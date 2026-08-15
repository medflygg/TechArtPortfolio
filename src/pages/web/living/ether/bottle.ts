import * as THREE from "three";

/** Dark studio env — glass reflections without HDR files. */
export function createStudioEnv(renderer: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x0a0a0c);

  const addPanel = (color: number, pos: THREE.Vector3, rot: THREE.Euler, w = 4, h = 4) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
    );
    m.position.copy(pos);
    m.rotation.copy(rot);
    envScene.add(m);
  };

  // Soft key / fill / rim panels for chrome & glass
  addPanel(0xffffff, new THREE.Vector3(0, 3.2, 2), new THREE.Euler(-1.1, 0, 0), 6, 2.2);
  addPanel(0xd8e4f0, new THREE.Vector3(-3.5, 1.2, 1), new THREE.Euler(0, 1.0, 0), 2.5, 4);
  addPanel(0xffe8d8, new THREE.Vector3(3.2, 0.8, 0.5), new THREE.Euler(0, -1.0, 0), 2.2, 3.5);
  addPanel(0x6b4eff, new THREE.Vector3(0, 0.5, -3), new THREE.Euler(0, 0, 0), 5, 3);
  addPanel(0x222226, new THREE.Vector3(0, -2, 0), new THREE.Euler(Math.PI / 2, 0, 0), 8, 8);

  const tex = pmrem.fromScene(envScene, 0.04).texture;
  envScene.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return { envMap: tex, pmrem };
}

const liquidVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
uniform float uTime;
uniform float uTilt;
void main() {
  vUv = uv;
  vec3 p = position;
  float wave = sin(p.x * 5.0 + uTime * 1.15) * 0.01 + cos(p.z * 4.2 + uTime * 0.9) * 0.008;
  p.y += wave * (0.35 + uTilt * 0.4);
  p.x += uTilt * 0.04 * (p.y + 0.35);
  vec4 world = modelMatrix * vec4(p, 1.0);
  vPosW = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const liquidFrag = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColorDeep;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vec3 viewDir = normalize(cameraPosition - vPosW);
  float fresnel = pow(1.0 - max(dot(normalize(vNormalW), viewDir), 0.0), 2.4);
  float depth = smoothstep(0.0, 1.0, vUv.y);
  float swirl = sin(vUv.y * 12.0 + uTime * 0.5 + vPosW.x * 2.8) * 0.5 + 0.5;
  vec3 col = mix(uColorDeep, uColor, depth * 0.6 + swirl * 0.4);
  col += fresnel * 0.45;
  col += uColor * 0.25;
  float alpha = 0.9;
  gl_FragColor = vec4(col, alpha);
}
`;

export type EtherBottle = THREE.Group;

type BottleControls = {
  setLiquidColor: (hex: string) => void;
  setLiquidVisible: (v: boolean) => void;
  setCapVisible: (v: boolean) => void;
  setLabelVisible: (v: boolean) => void;
  tickLiquid: (t: number, tilt: number) => void;
  applyEnvMap: (env: THREE.Texture | null) => void;
};

export function getBottleControls(bottle: THREE.Group): BottleControls {
  return bottle.userData as BottleControls;
}

function deepen(hex: string) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(0.48);
  return c;
}

export function vividLiquid(hex: string) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, Math.min(1, hsl.s * 1.1 + 0.12), Math.max(0.32, Math.min(0.5, hsl.l * 1.25 + 0.1)));
  return `#${c.getHexString()}`;
}

function makeLabelTexture(name: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 512);
  ctx.fillStyle = "rgba(12,12,12,0.94)";
  ctx.fillRect(64, 64, 384, 384);
  ctx.strokeStyle = "rgba(234,230,221,0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(84, 84, 344, 344);
  ctx.fillStyle = "#EAE6DD";
  ctx.textAlign = "center";
  ctx.font = "500 26px 'Cormorant Garamond', serif";
  ctx.fillText("ÉTHER", 256, 160);
  ctx.font = "500 46px 'Cormorant Garamond', serif";
  ctx.fillText(name.toUpperCase(), 256, 255);
  ctx.font = "400 15px 'DM Sans', sans-serif";
  ctx.fillStyle = "rgba(234,230,221,0.65)";
  ctx.fillText("EXTRAIT DE PARFUM", 256, 320);
  ctx.fillText("100 ML", 256, 355);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Editorial rectangular flacon — authored geometry, not AI / Sketchfab. */
export function createEtherBottle(liquidHex: string, labelName = "NOCTURNE"): EtherBottle {
  const group = new THREE.Group();
  group.name = "bottle";

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.06,
    transmission: 0.92,
    thickness: 1.5,
    ior: 1.48,
    transparent: true,
    opacity: 1,
    envMapIntensity: 1.6,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: 0xd8d2c6,
    metalness: 0.97,
    roughness: 0.16,
    envMapIntensity: 1.5,
  });
  const glassMats = [glass];
  const metalMats = [metal];

  const vivid = vividLiquid(liquidHex);
  const liquidUniforms = {
    uColor: { value: new THREE.Color(vivid) },
    uColorDeep: { value: deepen(vivid) },
    uTime: { value: 0 },
    uTilt: { value: 0 },
  };
  const liquidMat = new THREE.ShaderMaterial({
    uniforms: liquidUniforms,
    vertexShader: liquidVert,
    fragmentShader: liquidFrag,
    transparent: true,
    depthWrite: true,
  });
  const liquid = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.22, 0.34), liquidMat);
  liquid.name = "liquid";
  liquid.position.y = -0.02;
  group.add(liquid);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.78, 0.5), glass);
  body.name = "body";
  body.position.y = 0.1;
  group.add(body);

  // Subtle edge catch (reads as glass without env)
  const edge = new THREE.MeshBasicMaterial({
    color: 0xeae6dd,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const eL = new THREE.Mesh(new THREE.BoxGeometry(0.018, 1.65, 0.46), edge);
  eL.position.set(-0.45, 0.1, 0);
  const eR = eL.clone();
  eR.position.x = 0.45;
  group.add(eL, eR);

  const neckGlass = glass.clone();
  glassMats.push(neckGlass);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.145, 0.34, 40), neckGlass);
  neck.position.y = 1.16;
  group.add(neck);

  const collarMat = metal.clone();
  metalMats.push(collarMat);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.012, 12, 40), collarMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 1.32;
  group.add(collar);

  const cap = new THREE.Group();
  cap.name = "cap";
  const capMat = metal.clone();
  const capTopMat = new THREE.MeshStandardMaterial({
    color: 0xeae6dd,
    metalness: 0.95,
    roughness: 0.14,
    envMapIntensity: 1.5,
  });
  metalMats.push(capMat, capTopMat);
  const capBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.32, 40), capMat);
  capBody.position.y = 1.52;
  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 0.045, 40), capTopMat);
  capTop.position.y = 1.7;
  cap.add(capBody, capTop);
  group.add(cap);

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.58),
    new THREE.MeshBasicMaterial({
      map: makeLabelTexture(labelName),
      transparent: true,
      opacity: 0.98,
      depthWrite: false,
    }),
  );
  label.name = "label";
  label.position.set(0, 0.12, 0.255);
  group.add(label);

  group.userData = {
    setLiquidColor: (hex: string) => {
      const v = vividLiquid(hex);
      liquidUniforms.uColor.value.set(v);
      liquidUniforms.uColorDeep.value.copy(deepen(v));
    },
    setLiquidVisible: (v: boolean) => {
      liquid.visible = v;
    },
    setCapVisible: (v: boolean) => {
      cap.visible = v;
    },
    setLabelVisible: (v: boolean) => {
      label.visible = v;
    },
    tickLiquid: (t: number, tilt: number) => {
      liquidUniforms.uTime.value = t;
      liquidUniforms.uTilt.value = tilt;
    },
    applyEnvMap: (env: THREE.Texture | null) => {
      for (const m of glassMats) {
        m.envMap = env;
        m.needsUpdate = true;
      }
      for (const m of metalMats) {
        m.envMap = env;
        m.needsUpdate = true;
      }
    },
  } satisfies BottleControls;

  return group;
}

export function setBottleLabel(bottle: THREE.Group, name: string) {
  const label = bottle.getObjectByName("label") as THREE.Mesh | undefined;
  if (!label || !(label.material instanceof THREE.MeshBasicMaterial)) return;
  const prev = label.material.map;
  label.material.map = makeLabelTexture(name);
  label.material.needsUpdate = true;
  prev?.dispose();
}
