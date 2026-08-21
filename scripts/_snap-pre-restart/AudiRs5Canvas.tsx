import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { launchTelemetry, type ChapterId, type ConfigState } from "./audiRs5Data";
import { RS5_GLB, createStudioEnv, loadRs5Glb, type Rs5Handle } from "./loadRs5Glb";

export type AudiSceneState = {
  chapter: ChapterId;
  config: ConfigState;
  launchT: number;
  /** Visual body roll in degrees for Load Lab (UI-scale). */
  dynamicsRollDeg: number;
  reducedMotion: boolean;
};

type Props = {
  state: AudiSceneState;
  className?: string;
  onReady?: () => void;
  onProgress?: (p: number) => void;
};

type CamPose = {
  pos: THREE.Vector3;
  target: THREE.Vector3;
  up: THREE.Vector3;
  fov: number;
};

const DEFAULT_UP = new THREE.Vector3(0, 1, 0);

/** Packshot framing — catalogue height; vertical placement via model drop, not look-target tricks */
const CAMERAS: Record<ChapterId, CamPose> = {
  hero: {
    // Neutral: midpoint between original packshot and nose-biased framing
    pos: new THREE.Vector3(6.025, 1.55, 3.175),
    target: new THREE.Vector3(0.075, 0.62, 0.2),
    up: DEFAULT_UP.clone(),
    fov: 33,
  },
  specs: {
    // Keep the previous side angle; pan camera+target along view-left (car → right of frame)
    // Base: (7.4,1.78,3.55)→(-0.15,0.5,-1.05) + left(0.521,0,-0.854)*2.6
    pos: new THREE.Vector3(8.75, 1.78, 1.33),
    target: new THREE.Vector3(1.2, 0.5, -3.27),
    up: DEFAULT_UP.clone(),
    fov: 29,
  },
  exterior: {
    pos: new THREE.Vector3(7.0, 1.65, 0.35),
    target: new THREE.Vector3(0, 0.65, 0.05),
    up: DEFAULT_UP.clone(),
    fov: 34,
  },
  acceleration: {
    // Locked packshot: balanced scale, strip + digits in frame (user-approved)
    pos: new THREE.Vector3(9.45, 2.05, 0.72),
    target: new THREE.Vector3(0.05, 0.62, 0.48),
    up: DEFAULT_UP.clone(),
    fov: 27,
  },
  quattro: {
    pos: new THREE.Vector3(0.02, 12.2, 0.01),
    target: new THREE.Vector3(0, 0.12, 0),
    up: new THREE.Vector3(0, 0, -1),
    fov: 26,
  },
  dynamics: {
    pos: new THREE.Vector3(5.55, 1.5, 3.7),
    target: new THREE.Vector3(0, 0.55, 0.1),
    up: DEFAULT_UP.clone(),
    fov: 33,
  },
  cabin: {
    pos: new THREE.Vector3(0.42, 1.22, -0.08),
    target: new THREE.Vector3(0.28, 0.96, 0.7),
    up: DEFAULT_UP.clone(),
    fov: 55,
  },
  order: {
    pos: new THREE.Vector3(6.9, 1.58, 1.85),
    target: new THREE.Vector3(0, 0.62, 0.05),
    up: DEFAULT_UP.clone(),
    fov: 32,
  },
};

const CABIN_CAMERAS: Record<ConfigState["cabinView"], CamPose> = {
  driver: CAMERAS.cabin,
  dash: {
    pos: new THREE.Vector3(0.05, 1.26, 0.05),
    target: new THREE.Vector3(0, 0.95, 0.7),
    up: DEFAULT_UP.clone(),
    fov: 52,
  },
  seats: {
    pos: new THREE.Vector3(0.55, 1.05, 0.15),
    target: new THREE.Vector3(0.42, 0.72, -0.35),
    up: DEFAULT_UP.clone(),
    fov: 40,
  },
  rear: {
    pos: new THREE.Vector3(0, 1.2, 0.48),
    target: new THREE.Vector3(0, 0.92, -0.85),
    up: DEFAULT_UP.clone(),
    fov: 52,
  },
};

const STRIP_LEN = 6.6;
/** Toward camera — clear of the side silhouette, reads as a floor gauge */
const STRIP_X = 2.35;
const STRIP_Y = 0.015;
/** Rear bumper → slightly past the nose (nose ≈ +Z) */
const STRIP_Z_START = -2.55;
const STRIP_DIR = 1;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function poseToQuat(pose: CamPose) {
  const m = new THREE.Matrix4().lookAt(pose.pos, pose.target, pose.up);
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

type CamRail = {
  from: CamPose;
  to: CamPose;
  startedAt: number;
  duration: number;
};

function slerpDir(from: THREE.Vector3, to: THREE.Vector3, t: number) {
  const a = from.clone().normalize();
  const b = to.clone().normalize();
  const dot = THREE.MathUtils.clamp(a.dot(b), -1, 1);
  if (dot > 0.9995) return a.lerp(b, t).normalize();
  if (dot < -0.9995) {
    const axis = Math.abs(a.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    axis.cross(a).normalize();
    return a.clone().applyAxisAngle(axis, Math.PI * t).normalize();
  }
  const q = new THREE.Quaternion().setFromUnitVectors(a, b);
  const qPart = new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(), q, t);
  return a.clone().applyQuaternion(qPart).normalize();
}

/** Linear pose blend (caller applies easing). Spherical orbit around look target. */
function blendPose(a: CamPose, b: CamPose, t: number): CamPose {
  const u = THREE.MathUtils.clamp(t, 0, 1);
  const target = a.target.clone().lerp(b.target, u);
  const q = poseToQuat(a).slerp(poseToQuat(b), u);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(q).normalize();
  const fromOffset = a.pos.clone().sub(a.target);
  const toOffset = b.pos.clone().sub(b.target);
  const fromLen = Math.max(fromOffset.length(), 0.05);
  const toLen = Math.max(toOffset.length(), 0.05);
  const dir = slerpDir(fromOffset, toOffset, u);
  const radius = Math.exp(THREE.MathUtils.lerp(Math.log(fromLen), Math.log(toLen), u));
  const pos = target.clone().addScaledVector(dir, radius);
  return {
    pos,
    target,
    up,
    fov: THREE.MathUtils.lerp(a.fov, b.fov, u),
  };
}

function sampleRail(rail: CamRail, now: number): { pose: CamPose; done: boolean } {
  const raw = rail.duration <= 0 ? 1 : (now - rail.startedAt) / rail.duration;
  const t = easeInOutCubic(THREE.MathUtils.clamp(raw, 0, 1));
  return { pose: blendPose(rail.from, rail.to, t), done: raw >= 1 };
}

function applyPose(cam: THREE.PerspectiveCamera, look: THREE.Vector3, pose: CamPose) {
  cam.position.copy(pose.pos);
  look.copy(pose.target);
  cam.up.copy(pose.up).normalize();
  cam.fov = pose.fov;
  cam.updateProjectionMatrix();
  cam.lookAt(look);
}

/** Orbit camera around look-target on world up — car stays fixed, viewpoint sweeps. */
function orbitPoseYaw(pose: CamPose, yawRad: number): CamPose {
  const offset = pose.pos.clone().sub(pose.target);
  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawRad);
  return {
    pos: pose.target.clone().add(offset),
    target: pose.target.clone(),
    up: pose.up.clone(),
    fov: pose.fov,
  };
}

function capturePose(cam: THREE.PerspectiveCamera, look: THREE.Vector3): CamPose {
  return {
    pos: cam.position.clone(),
    target: look.clone(),
    up: cam.up.clone(),
    fov: cam.fov,
  };
}

function dampPose(current: CamPose, goal: CamPose, dt: number, lambda = 5.5): CamPose {
  return blendPose(current, goal, 1 - Math.exp(-lambda * dt));
}

function railDuration(from: ChapterId | null, to: ChapterId, reduced: boolean) {
  if (reduced) return 0;
  if (to === "quattro" || from === "quattro") return 1600;
  if (to === "cabin" || from === "cabin") return 1400;
  return 1200;
}

function makeStripLabel(text: string, color = "#e8e2d6") {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 64);
  ctx.fillStyle = color;
  ctx.font = "600 24px 'Segoe UI', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const spr = new THREE.Sprite(mat);
  spr.scale.set(0.72, 0.18, 1);
  spr.renderOrder = 6;
  return { spr, tex, mat };
}

function buildDistanceStrip() {
  const group = new THREE.Group();
  group.name = "distanceStrip";
  group.visible = false;

  const champagne = new THREE.Color(0xd7b98f);
  const bone = new THREE.Color(0xe8e2d6);
  const rsRed = new THREE.Color(0xb81c2c);
  const trackIdle = new THREE.Color(0x4a4842);

  const trackMat = new THREE.MeshBasicMaterial({
    color: trackIdle.clone(),
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    depthTest: false,
  });
  const accentMat = new THREE.MeshBasicMaterial({
    color: champagne.clone(),
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: false,
  });
  const boneMat = new THREE.MeshBasicMaterial({
    color: bone.clone(),
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: false,
  });
  const hairMat = new THREE.MeshBasicMaterial({
    color: 0x6e6a62,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    depthTest: false,
  });

  const zAt = (frac: number) => STRIP_Z_START + STRIP_DIR * STRIP_LEN * frac;

  // Dimension rail under the body — thin, readable, not a runway
  const track = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.004, STRIP_LEN), trackMat);
  track.position.set(STRIP_X, STRIP_Y, zAt(0.5));
  track.renderOrder = 2;
  group.add(track);

  const fillGeo = new THREE.BoxGeometry(0.02, 0.006, 1);
  const fill = new THREE.Mesh(fillGeo, accentMat);
  fill.position.set(STRIP_X, STRIP_Y + 0.003, zAt(0));
  fill.scale.z = 0.001;
  fill.renderOrder = 3;
  group.add(fill);

  const tickGeos: THREE.BufferGeometry[] = [];
  const majorGeo = new THREE.BoxGeometry(0.11, 0.004, 0.01);
  const minorGeo = new THREE.BoxGeometry(0.06, 0.003, 0.007);
  tickGeos.push(majorGeo, minorGeo);

  const endLabelAssets: { spr: THREE.Sprite; tex: THREE.CanvasTexture; mat: THREE.SpriteMaterial }[] = [];
  const endSpecs: { frac: number; text: string; color: string }[] = [
    { frac: 0, text: "0 m", color: "#c8c2b6" },
    { frac: 1, text: "54 m", color: "#d7b98f" },
  ];
  for (const spec of endSpecs) {
    const z = zAt(spec.frac);
    const tick = new THREE.Mesh(majorGeo, boneMat);
    tick.position.set(STRIP_X, STRIP_Y + 0.003, z);
    tick.renderOrder = 3;
    group.add(tick);
    const label = makeStripLabel(spec.text, spec.color);
    // Floor gutter toward camera — keep clear of body/wheels
    label.spr.position.set(STRIP_X + 0.42, STRIP_Y + 0.06, z);
    group.add(label.spr);
    endLabelAssets.push(label);
  }

  for (const frac of [1 / 3, 2 / 3]) {
    const z = zAt(frac);
    const tick = new THREE.Mesh(minorGeo, hairMat);
    tick.position.set(STRIP_X, STRIP_Y + 0.002, z);
    tick.renderOrder = 3;
    group.add(tick);
  }

  // Low cursor — travels the rail; no tall stem into the silhouette
  const markerBlade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.028), accentMat);
  const markerBase = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 0.018), boneMat);
  const marker = new THREE.Group();
  markerBase.position.y = 0.01;
  markerBlade.position.y = 0.024;
  marker.add(markerBase);
  marker.add(markerBlade);
  marker.position.set(STRIP_X, STRIP_Y, zAt(0));
  marker.renderOrder = 5;
  group.add(marker);

  const liveCanvas = document.createElement("canvas");
  liveCanvas.width = 360;
  liveCanvas.height = 96;
  const liveCtx = liveCanvas.getContext("2d")!;
  const liveTex = new THREE.CanvasTexture(liveCanvas);
  liveTex.colorSpace = THREE.SRGBColorSpace;
  const liveMat = new THREE.SpriteMaterial({
    map: liveTex,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const liveSpr = new THREE.Sprite(liveMat);
  liveSpr.scale.set(1.05, 0.28, 1);
  // Sit on the rail like a dimension readout (not floating above)
  liveSpr.position.set(STRIP_X + 0.38, STRIP_Y + 0.09, zAt(0.1));
  liveSpr.renderOrder = 7;
  group.add(liveSpr);

  const paintLive = (distM: number, nm: number, rpm: number, heat: number) => {
    liveCtx.clearRect(0, 0, 360, 96);
    const ink = heat > 0.4 ? "#f0a8a8" : "#e8e2d6";
    const mute = heat > 0.4 ? "#f5c4c4" : "#a8a094";
    liveCtx.textAlign = "left";
    liveCtx.textBaseline = "middle";
    liveCtx.fillStyle = ink;
    liveCtx.font = "600 38px 'Segoe UI', system-ui, sans-serif";
    liveCtx.fillText(`${distM.toFixed(1)} m`, 8, 28);
    liveCtx.font = "500 18px 'Segoe UI', system-ui, sans-serif";
    liveCtx.fillStyle = mute;
    liveCtx.fillText(`${nm} Nm · ${rpm.toLocaleString("en-US")} rpm`, 8, 66);
    liveTex.needsUpdate = true;
  };
  paintLive(0, 240, 1600, 0);

  const endCap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.006, 0.012), accentMat);
  endCap.position.set(STRIP_X, STRIP_Y + 0.004, zAt(1));
  endCap.renderOrder = 3;
  group.add(endCap);

  const dispose = () => {
    track.geometry.dispose();
    fillGeo.dispose();
    for (const g of tickGeos) g.dispose();
    markerBlade.geometry.dispose();
    markerBase.geometry.dispose();
    endCap.geometry.dispose();
    trackMat.dispose();
    accentMat.dispose();
    boneMat.dispose();
    hairMat.dispose();
    liveTex.dispose();
    liveMat.dispose();
    for (const l of endLabelAssets) {
      l.tex.dispose();
      l.mat.dispose();
    }
  };

  /** `t` = linear launch time 0–1; marker follows distance fraction. */
  const setProgress = (t: number) => {
    const telem = launchTelemetry(t);
    const { u, distFrac, distM, torqueNm, rpm } = telem;
    const z = zAt(distFrac);
    marker.position.z = z;
    fill.position.z = zAt(distFrac * 0.5);
    fill.scale.z = Math.max(0.001, STRIP_LEN * distFrac);

    const heat = u;
    track.scale.x = 1 + heat * 1.2;
    fill.scale.x = 1 + heat * 0.9;
    marker.scale.set(1 + heat * 0.18, 1 + heat * 0.12, 1 + heat * 0.18);

    trackMat.color.copy(trackIdle).lerp(rsRed, heat * 0.45);
    accentMat.color.copy(champagne).lerp(rsRed, heat * 0.75);
    boneMat.color.copy(bone).lerp(rsRed, heat * 0.22);
    paintLive(distM, torqueNm, rpm, heat);
  };

  setProgress(0);
  return { group, setProgress, dispose };
}

export function AudiRs5Canvas({ state, className, onReady, onProgress }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let raf = 0;
    let handle: Rs5Handle | null = null;
    let modelBaseY = 0;
    let envMap: THREE.Texture | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    let applied = {
      paint: "",
      caliper: "",
      interior: "",
      wheel: "",
      sportExhaust: null as boolean | null,
      cabinMode: null as boolean | null,
    };

    RectAreaLightUniformsLib.init();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x101010, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Dark void — no fog on exterior; HDRI never visible as backdrop
    scene.background = new THREE.Color(0x101010);
    scene.fog = null;

    const camera = new THREE.PerspectiveCamera(33, 1, 0.05, 80);
    const look = new THREE.Vector3(0, 0.6, 0);
    camera.position.copy(CAMERAS.hero.pos);
    camera.lookAt(look);
    let livePose = capturePose(camera, look);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 3.2;
    controls.maxDistance = 9;
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.target.copy(look);
    controls.enabled = false;
    controls.autoRotateSpeed = 0.26;
    let lastInteractionAt = performance.now();
    let lastChapter: ChapterId | null = null;
    let lastCabinView: ConfigState["cabinView"] | null = null;
    let rail: CamRail | null = null;
    let exteriorReady = false;
    let lastFrame = performance.now();

    controls.addEventListener("start", () => {
      lastInteractionAt = performance.now();
      controls.autoRotate = false;
    });
    controls.addEventListener("end", () => {
      lastInteractionAt = performance.now();
    });

    // Softbox packshot + studio HDRI reflections (pre-restart live look)
    const key = new THREE.RectAreaLight(0xfff6ee, 5.2, 5.5, 3.2);
    key.position.set(3.8, 5.2, 3.4);
    key.lookAt(0, 0.6, 0);
    scene.add(key);

    const rimBox = new THREE.RectAreaLight(0xc8d4e0, 2.8, 3.5, 2.4);
    rimBox.position.set(-4.2, 3.4, -3.2);
    rimBox.lookAt(0, 0.7, 0);
    scene.add(rimBox);

    const fill = new THREE.HemisphereLight(0xd8e4dc, 0x101010, 0.36);
    scene.add(fill);

    const keyShadow = new THREE.DirectionalLight(0xfff4ea, 0.48);
    keyShadow.position.set(4.5, 7.5, 3.5);
    keyShadow.castShadow = true;
    keyShadow.shadow.mapSize.set(2048, 2048);
    keyShadow.shadow.bias = -0.0002;
    keyShadow.shadow.normalBias = 0.025;
    keyShadow.shadow.radius = 4.5;
    keyShadow.shadow.camera.near = 1;
    keyShadow.shadow.camera.far = 30;
    keyShadow.shadow.camera.left = -8;
    keyShadow.shadow.camera.right = 7;
    keyShadow.shadow.camera.top = 6;
    keyShadow.shadow.camera.bottom = -6;
    scene.add(keyShadow);

    // Dual floor: faint matte disk + ShadowMaterial catcher (empty space)
    const floorGeo = new THREE.CircleGeometry(14, 80);
    const matteMat = new THREE.MeshBasicMaterial({
      color: 0x0c0c0c,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
    });
    const matteFloor = new THREE.Mesh(floorGeo, matteMat);
    matteFloor.rotation.x = -Math.PI / 2;
    matteFloor.position.y = -0.002;
    scene.add(matteFloor);

    const catcherMat = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.52 });
    const catcher = new THREE.Mesh(floorGeo.clone(), catcherMat);
    catcher.rotation.x = -Math.PI / 2;
    catcher.position.y = 0.001;
    catcher.receiveShadow = true;
    scene.add(catcher);

    const distanceStrip = buildDistanceStrip();
    scene.add(distanceStrip.group);

    // Soft bloom + MSAA on composer buffers + SMAA.
    // Note: WebGLRenderer antialias does NOT apply to EffectComposer RTs (samples were 0).
    const composer = new EffectComposer(renderer);
    const msaaSamples = Math.min(8, renderer.capabilities.maxSamples || 4);
    composer.renderTarget1.samples = msaaSamples;
    composer.renderTarget2.samples = msaaSamples;
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.025, 0.5, 0.98);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
    composer.addPass(new SMAAPass());

    const startRail = (to: CamPose, duration: number) => {
      rail = {
        from: capturePose(camera, look),
        to: {
          pos: to.pos.clone(),
          target: to.target.clone(),
          up: to.up.clone(),
          fov: to.fov,
        },
        startedAt: performance.now(),
        duration: stateRef.current.reducedMotion ? 0 : duration,
      };
      exteriorReady = false;
      controls.enabled = false;
      controls.autoRotate = false;
    };

    const resolvePose = (st: AudiSceneState): CamPose =>
      st.chapter === "cabin" ? CABIN_CAMERAS[st.config.cabinView] : CAMERAS[st.chapter];

    void (async () => {
      const env = await createStudioEnv(renderer);
      if (disposed) {
        env.envMap.dispose();
        env.pmrem.dispose();
        return;
      }
      envMap = env.envMap;
      pmrem = env.pmrem;
      scene.environment = envMap;
      scene.background = new THREE.Color(0x101010);

      try {
        const h = await loadRs5Glb(RS5_GLB, { envMap });
        if (disposed) {
          h.dispose();
          return;
        }
        handle = h;
        h.root.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            const glass = mats.some((m) => {
              const n = (m.name || "").toLowerCase();
              return (
                n.includes("windshiled") ||
                n.includes("windshield") ||
                n.includes("roof_black") ||
                n.includes("hl_cover") ||
                n.includes("tail_cover")
              );
            });
            o.castShadow = !glass;
            o.receiveShadow = true;
          }
        });
        scene.add(h.root);
        modelBaseY = h.root.position.y;
        onReadyRef.current?.();
        onProgressRef.current?.(1);
      } catch (err) {
        console.error("RS5 GLB failed", err);
        onProgressRef.current?.(1);
      }
    })();

    let fake = 0;
    const fakeIv = window.setInterval(() => {
      fake = Math.min(0.92, fake + 0.04);
      if (!handle) onProgressRef.current?.(fake);
      else window.clearInterval(fakeIv);
    }, 180);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const tick = (now = performance.now()) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      const st = stateRef.current;
      const pose = resolvePose(st);
      const orbitWanted = st.chapter === "exterior" || st.chapter === "order";
      const cabinMode = st.chapter === "cabin";
      const launch = st.chapter === "acceleration";
      const launchEnergy = launch ? Math.sin(Math.PI * Math.min(1, st.launchT)) : 0;

      if (st.chapter !== lastChapter) {
        startRail(pose, railDuration(lastChapter, st.chapter, st.reducedMotion));
        lastChapter = st.chapter;
        lastCabinView = st.config.cabinView;
        lastInteractionAt = now;
      } else if (st.chapter === "cabin" && st.config.cabinView !== lastCabinView) {
        startRail(pose, st.reducedMotion ? 0 : 900);
        lastCabinView = st.config.cabinView;
      }

      if (rail) {
        const sampled = sampleRail(rail, now);
        livePose = sampled.pose;
        applyPose(camera, look, livePose);
        controls.target.copy(look);
        if (sampled.done) {
          livePose = {
            pos: rail.to.pos.clone(),
            target: rail.to.target.clone(),
            up: rail.to.up.clone(),
            fov: rail.to.fov,
          };
          applyPose(camera, look, livePose);
          controls.target.copy(look);
          rail = null;
          if (orbitWanted) {
            exteriorReady = true;
            controls.enabled = true;
            controls.update();
          }
        }
      } else if (orbitWanted && exteriorReady) {
        controls.enabled = true;
        controls.autoRotate = now - lastInteractionAt > 2200;
        controls.update();
        look.copy(controls.target);
        livePose = capturePose(camera, look);
      } else if (!orbitWanted) {
        controls.enabled = false;
        controls.autoRotate = false;
        // Hero ambient: camera orbits the car (±12°, 60s) around a nose-biased framing.
        const desired =
          st.chapter === "hero" && !st.reducedMotion
            ? orbitPoseYaw(
                pose,
                Math.sin((now / 1000) * ((Math.PI * 2) / 60)) * THREE.MathUtils.degToRad(12),
              )
            : pose;
        livePose = dampPose(livePose, desired, dt, 2.6);
        applyPose(camera, look, livePose);
        controls.target.copy(look);
      }

      key.intensity = THREE.MathUtils.lerp(key.intensity, cabinMode ? 2.8 : 5.2 + launchEnergy * 0.5, 0.08);
      rimBox.intensity = THREE.MathUtils.lerp(rimBox.intensity, cabinMode ? 1.4 : 2.8, 0.08);
      fill.intensity = THREE.MathUtils.lerp(fill.intensity, cabinMode ? 0.24 : 0.36, 0.08);
      keyShadow.intensity = THREE.MathUtils.lerp(keyShadow.intensity, cabinMode ? 0.28 : 0.48, 0.08);
      renderer.toneMappingExposure = THREE.MathUtils.lerp(
        renderer.toneMappingExposure,
        cabinMode ? 0.92 : 1.05,
        0.08,
      );
      scene.fog = cabinMode ? new THREE.Fog(0x0e0e0e, 4, 14) : null;
      bloomPass.strength = THREE.MathUtils.lerp(bloomPass.strength, cabinMode ? 0.02 : 0.025 + launchEnergy * 0.015, 0.08);

      const showGround = st.chapter !== "quattro";
      matteFloor.visible = showGround;
      catcher.visible = showGround;
      catcherMat.opacity = st.chapter === "quattro" ? 0.15 : 0.52;

      distanceStrip.group.visible = launch;
      distanceStrip.setProgress(st.launchT);

      if (handle) {
        const cfg = st.config;
        if (applied.paint !== cfg.paint) {
          handle.setPaint(cfg.paint);
          applied.paint = cfg.paint;
        }
        if (applied.caliper !== cfg.caliper) {
          handle.setCaliper(cfg.caliper);
          applied.caliper = cfg.caliper;
        }
        if (applied.interior !== cfg.interior) {
          handle.setInterior(cfg.interior);
          applied.interior = cfg.interior;
        }
        if (applied.wheel !== cfg.wheel) {
          handle.setWheel(cfg.wheel);
          applied.wheel = cfg.wheel;
        }
        if (applied.sportExhaust !== cfg.sportExhaust) {
          handle.setSportExhaust(cfg.sportExhaust);
          applied.sportExhaust = cfg.sportExhaust;
        }
        if (applied.cabinMode !== cabinMode) {
          handle.setCabinMode(cabinMode);
          applied.cabinMode = cabinMode;
          handle.setEnvIntensity(cabinMode ? 0.8 : 1.15);
          handle.setPaint(cfg.paint);
        }

        const stageZ = st.chapter === "hero" ? -0.55 : st.chapter === "specs" ? 1.25 : 0;
        // Slight world drop so the silhouette sits lower in the hero packshot.
        const stageY =
          st.chapter === "hero" ||
          st.chapter === "specs" ||
          st.chapter === "exterior" ||
          st.chapter === "order"
            ? modelBaseY - 0.32
            : modelBaseY;
        handle.root.rotation.y = THREE.MathUtils.lerp(handle.root.rotation.y, 0, 0.1);
        handle.root.rotation.z = THREE.MathUtils.lerp(handle.root.rotation.z, 0, 0.1);
        handle.root.position.x = THREE.MathUtils.lerp(handle.root.position.x, 0, 0.1);
        handle.root.position.z = THREE.MathUtils.lerp(handle.root.position.z, stageZ, 0.1);
        handle.root.position.y = THREE.MathUtils.lerp(handle.root.position.y, stageY, 0.1);
        // Keep contact shadow glued to the tires when the stage drops / shifts.
        const floorY = stageY;
        matteFloor.position.y = THREE.MathUtils.lerp(matteFloor.position.y, floorY - 0.002, 0.1);
        catcher.position.y = THREE.MathUtils.lerp(catcher.position.y, floorY + 0.001, 0.1);
        matteFloor.position.z = THREE.MathUtils.lerp(matteFloor.position.z, stageZ, 0.1);
        catcher.position.z = THREE.MathUtils.lerp(catcher.position.z, stageZ, 0.1);

        if (st.chapter === "dynamics") {
          const rollRad = Math.min(0.02, Math.max(0, st.dynamicsRollDeg) * 0.0042);
          handle.car.rotation.z = THREE.MathUtils.lerp(handle.car.rotation.z, -rollRad, 0.07);
          handle.car.rotation.x = THREE.MathUtils.lerp(handle.car.rotation.x, 0, 0.08);
        } else {
          handle.car.rotation.z = THREE.MathUtils.lerp(handle.car.rotation.z, 0, 0.08);
          handle.car.rotation.x = THREE.MathUtils.lerp(handle.car.rotation.x, 0, 0.08);
        }
      }

      composer.render();
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearInterval(fakeIv);
      ro.disconnect();
      controls.dispose();
      handle?.dispose();
      distanceStrip.dispose();
      floorGeo.dispose();
      matteMat.dispose();
      catcherMat.dispose();
      catcher.geometry.dispose();
      envMap?.dispose();
      pmrem?.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}
