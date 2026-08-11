import {
  defaultRainForestParams,
  type RainForestParams,
} from "../shaders/rainForestParams";

const VERT = `#version 300 es
precision highp float;
const vec2 POS[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
void main() {
  gl_Position = vec4(POS[gl_VertexID], 0.0, 1.0);
}
`;

const PARAM_UNIFORMS = `
uniform float uTimeOfDay;
uniform float uCloudCover;
uniform float uFogAmount;
uniform float uWind;
uniform float uSeason;
uniform float uVignette;
`;

function wrapPass(source: string) {
  return `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;

uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform vec3 iChannelResolution[4];
${PARAM_UNIFORMS}

out vec4 outColor;

${source}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  outColor = color;
}
`;
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || "compile error";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, fragSource: string) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, wrapPass(fragSource));
  const program = gl.createProgram();
  if (!program) throw new Error("createProgram failed");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || "link error";
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

type Target = {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
};

function createTarget(gl: WebGL2RenderingContext, w: number, h: number): Target {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  const tryFloat = gl.getExtension("EXT_color_buffer_float");
  if (tryFloat) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  }
  if (!tryFloat || gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { tex, fbo };
}

function setCommonUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  opts: {
    w: number;
    h: number;
    time: number;
    delta: number;
    frame: number;
    mouse: Float32Array;
    channel0: WebGLTexture;
    params: RainForestParams;
    timeOfDay: number;
  },
) {
  gl.useProgram(program);
  const loc = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform3f(loc("iResolution"), opts.w, opts.h, 1);
  gl.uniform1f(loc("iTime"), opts.time);
  gl.uniform1f(loc("iTimeDelta"), opts.delta);
  gl.uniform1i(loc("iFrame"), opts.frame);
  gl.uniform4fv(loc("iMouse"), opts.mouse);

  gl.uniform1f(loc("uTimeOfDay"), opts.timeOfDay);
  gl.uniform1f(loc("uCloudCover"), opts.params.cloudCover);
  gl.uniform1f(loc("uFogAmount"), opts.params.fogAmount);
  gl.uniform1f(loc("uWind"), opts.params.wind);
  gl.uniform1f(loc("uSeason"), opts.params.season);
  gl.uniform1f(loc("uVignette"), opts.params.vignette);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, opts.channel0);
  gl.uniform1i(loc("iChannel0"), 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, opts.channel0);
  gl.uniform1i(loc("iChannel1"), 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, opts.channel0);
  gl.uniform1i(loc("iChannel2"), 2);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, opts.channel0);
  gl.uniform1i(loc("iChannel3"), 3);

  const res = [opts.w, opts.h, 1, opts.w, opts.h, 1, opts.w, opts.h, 1, opts.w, opts.h, 1];
  gl.uniform3fv(loc("iChannelResolution[0]"), new Float32Array(res));
}

export type MultipassSources = {
  bufferA: string;
  image: string;
};

export class RainForestRunner {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private bufferAProgram: WebGLProgram | null = null;
  private imageProgram: WebGLProgram | null = null;
  private targets: [Target, Target] | null = null;
  private readIndex = 0;
  private frame = 0;
  private start = performance.now();
  private last = performance.now();
  private raf = 0;
  private mouse = new Float32Array(4);
  private width = 1;
  private height = 1;
  private scale = 1;
  /** Cap matches other lab canvases; raises default res on HiDPI vs CSS pixels. */
  private pixelRatio = Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    2,
  );
  private disposed = false;
  private params: RainForestParams = { ...defaultRainForestParams };
  private cyclePhase = defaultRainForestParams.timeOfDay;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL2 is required for Rain Forest");
    this.gl = gl;
    this.canvas = canvas;
    gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("OES_texture_float_linear");
  }

  setSources(sources: MultipassSources) {
    const gl = this.gl;
    if (this.bufferAProgram) gl.deleteProgram(this.bufferAProgram);
    if (this.imageProgram) gl.deleteProgram(this.imageProgram);
    this.bufferAProgram = createProgram(gl, sources.bufferA);
    this.imageProgram = createProgram(gl, sources.image);
    this.frame = 0;
    this.start = performance.now();
    this.last = this.start;
  }

  setParams(params: RainForestParams) {
    this.params = params;
    if (!params.autoCycle) {
      this.cyclePhase = params.timeOfDay;
    }
    // Do not reset iFrame here — Shadertoy TAA needs continuous history.
    // Resetting on slider tweaks caused visible shake/smear.
  }

  private ensureTargets() {
    const gl = this.gl;
    const w = Math.max(1, Math.floor(this.canvas.clientWidth * this.pixelRatio * this.scale));
    const h = Math.max(1, Math.floor(this.canvas.clientHeight * this.pixelRatio * this.scale));
    // Ignore 1px layout jitter — recreating FBOs + frame=0 every tick shakes the image
    if (
      this.targets &&
      Math.abs(this.width - w) <= 1 &&
      Math.abs(this.height - h) <= 1
    ) {
      return;
    }
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    if (this.targets) {
      for (const t of this.targets) {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fbo);
      }
    }
    this.targets = [createTarget(gl, w, h), createTarget(gl, w, h)];
    this.readIndex = 0;
    this.frame = 0;
  }

  bindPointer(el: HTMLElement) {
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * this.width;
      const y = (1 - (e.clientY - rect.top) / rect.height) * this.height;
      this.mouse[0] = x;
      this.mouse[1] = y;
      if (e.buttons > 0) {
        this.mouse[2] = x;
        this.mouse[3] = y;
      }
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
    };
  }

  startLoop(onError?: (msg: string | null) => void) {
    let lastError: string | null | undefined;
    const report = (msg: string | null) => {
      if (msg === lastError) return;
      lastError = msg;
      onError?.(msg);
    };
    const tick = () => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(tick);
      try {
        this.renderFrame();
        report(null);
      } catch (err) {
        report(err instanceof Error ? err.message : "Rain Forest render failed");
      }
    };
    this.raf = requestAnimationFrame(tick);
  }

  private renderFrame() {
    if (!this.bufferAProgram || !this.imageProgram) return;
    this.ensureTargets();
    if (!this.targets) return;

    const gl = this.gl;
    const now = performance.now();
    const time = (now - this.start) / 1000;
    const delta = Math.max(0.001, (now - this.last) / 1000);
    this.last = now;

    if (this.params.autoCycle) {
      this.cyclePhase = (this.cyclePhase + delta * 0.035) % 1;
    } else {
      this.cyclePhase = this.params.timeOfDay;
    }

    const read = this.targets[this.readIndex];
    const write = this.targets[this.readIndex ^ 1];
    const common = {
      w: this.width,
      h: this.height,
      time,
      delta,
      frame: this.frame,
      mouse: this.mouse,
      params: this.params,
      timeOfDay: this.cyclePhase,
    };

    gl.bindFramebuffer(gl.FRAMEBUFFER, write.fbo);
    gl.viewport(0, 0, this.width, this.height);
    setCommonUniforms(gl, this.bufferAProgram, {
      ...common,
      channel0: read.tex,
    });
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width, this.height);
    setCommonUniforms(gl, this.imageProgram, {
      ...common,
      channel0: write.tex,
    });
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    this.readIndex ^= 1;
    this.frame += 1;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    const gl = this.gl;
    if (this.bufferAProgram) gl.deleteProgram(this.bufferAProgram);
    if (this.imageProgram) gl.deleteProgram(this.imageProgram);
    if (this.targets) {
      for (const t of this.targets) {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fbo);
      }
    }
  }
}
