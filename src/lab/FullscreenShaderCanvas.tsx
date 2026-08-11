import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

function wrapMainImage(userCode: string) {
  return `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
varying vec2 vUv;

${userCode}

void main() {
  vec2 fragCoord = vUv * iResolution.xy;
  vec4 color = vec4(0.0);
  mainImage(color, fragCoord);
  gl_FragColor = color;
}
`;
}

type Props = {
  code: string;
  onError?: (message: string | null) => void;
};

export function FullscreenShaderCanvas({ code, onError }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      iResolution: { value: new THREE.Vector3(1, 1, 1) },
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: wrapMainImage(code),
      uniforms,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // Surface WebGL compile/link errors
    const gl = renderer.getContext();
    const prevHandler = gl.getExtension?.("WEBGL_debug_shaders") ? null : null;
    void prevHandler;
    renderer.render(scene, camera);
    const prog = (material as unknown as { program?: { program?: WebGLProgram } })
      .program?.program;
    if (prog) {
      const linked = gl.getProgramParameter(prog, gl.LINK_STATUS);
      if (!linked) {
        onError?.(gl.getProgramInfoLog(prog) || "Program link failed");
      } else {
        onError?.(null);
      }
    } else {
      onError?.(null);
    }

    const mouse = new THREE.Vector4();
    const onPointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = rect.height - (e.clientY - rect.top);
      if (e.buttons > 0) {
        mouse.z = mouse.x;
        mouse.w = mouse.y;
      }
    };
    renderer.domElement.addEventListener("pointermove", onPointer);
    renderer.domElement.addEventListener("pointerdown", onPointer);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.iResolution.value.set(w, h, 1);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let frame = 0;
    const start = performance.now();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      uniforms.iTime.value = (performance.now() - start) / 1000;
      uniforms.iMouse.value.copy(mouse);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointer);
      renderer.domElement.removeEventListener("pointerdown", onPointer);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [code, onError]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
