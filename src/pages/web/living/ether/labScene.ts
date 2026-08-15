import * as THREE from "three";
import { createEtherBottle, getBottleControls } from "./bottle";
import { type IngredientId, INGREDIENTS, LAB_POOL } from "./etherWorld";

function glassMat(tint = 0xffffff) {
  return new THREE.MeshPhysicalMaterial({
    color: tint,
    metalness: 0,
    roughness: 0.06,
    transmission: 0.9,
    thickness: 1.0,
    ior: 1.45,
    transparent: true,
    envMapIntensity: 1.6,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  });
}

function makeCosmicLiquid(hex: string) {
  const uniforms = {
    uColor: { value: new THREE.Color(hex) },
    uTime: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vPos;
      void main() {
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPos;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      void main() {
        float n = hash(vUv * 12.0 + uTime * 0.15);
        float swirl = sin(vUv.y * 18.0 + uTime * 0.8 + vPos.x * 4.0) * 0.5 + 0.5;
        vec3 gold = vec3(0.85, 0.65, 0.28);
        vec3 col = mix(uColor * 0.55, uColor, swirl);
        col = mix(col, gold, n * 0.35 * (1.0 - vUv.y));
        col += uColor * 0.4;
        float spark = step(0.992, hash(vUv * 80.0 + floor(uTime * 4.0)));
        col += spark * 0.8;
        gl_FragColor = vec4(col, 0.92);
      }
    `,
  });
  return { mat, uniforms };
}

/** Dark luxury lab: marble slab, cosmic flask, ingredient vials. */
export function createLabScene() {
  const root = new THREE.Group();
  root.name = "labScene";
  const glassMats: THREE.MeshPhysicalMaterial[] = [];

  const table = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 0.12, 2.4),
    new THREE.MeshStandardMaterial({
      color: 0x161618,
      roughness: 0.32,
      metalness: 0.5,
    }),
  );
  table.position.y = -0.9;
  root.add(table);

  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.07, 1.25),
    new THREE.MeshStandardMaterial({
      color: 0x1c1c20,
      roughness: 0.22,
      metalness: 0.62,
    }),
  );
  slab.position.set(0, -0.82, 0.2);
  root.add(slab);

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 4.5),
    new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.95, metalness: 0.05 }),
  );
  wall.position.set(0, 0.9, -1.55);
  root.add(wall);

  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.045, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.55, metalness: 0.3 }),
  );
  shelf.position.set(0, 0.62, -1.28);
  root.add(shelf);

  // Erlenmeyer-ish flask (cone + neck)
  const flask = new THREE.Group();
  flask.name = "labFlask";
  const gMat = glassMat();
  glassMats.push(gMat);

  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.62, 1.15, 48), gMat);
  cone.position.y = 0.05;
  flask.add(cone);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.38, 32), gMat);
  neck.position.y = 0.78;
  flask.add(neck);

  const lip = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.012, 10, 32),
    new THREE.MeshStandardMaterial({ color: 0xc9c3b6, metalness: 0.7, roughness: 0.25 }),
  );
  lip.rotation.x = Math.PI / 2;
  lip.position.y = 0.97;
  flask.add(lip);

  const cosmic = makeCosmicLiquid("#6B4EFF");
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.5, 0.72, 40), cosmic.mat);
  liquid.name = "labLiquid";
  liquid.position.y = -0.12;
  liquid.renderOrder = 1;
  flask.add(liquid);

  flask.position.set(0, -0.15, 0.25);
  flask.scale.setScalar(1.05);
  root.add(flask);

  // Keep a spare perfume bottle silhouette behind as prop
  const prop = createEtherBottle("#3d2480", "ÉTHER");
  prop.scale.setScalar(0.32);
  prop.position.set(1.55, -0.35, 0.35);
  getBottleControls(prop).setLabelVisible(false);
  root.add(prop);

  const vials = new THREE.Group();
  vials.name = "vials";
  LAB_POOL.forEach((id, i) => {
    const vial = createVial(id, glassMats);
    const x = (i - (LAB_POOL.length - 1) / 2) * 0.48;
    vial.position.set(x, 0.78, -1.2);
    vial.userData.ingredient = id;
    vials.add(vial);
  });
  root.add(vials);

  const strip = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 0.05),
    new THREE.MeshBasicMaterial({ color: 0xeae6dd, transparent: true, opacity: 0.16 }),
  );
  strip.position.set(0, 1.9, -1.5);
  root.add(strip);

  root.userData.flask = flask;
  root.userData.prop = prop;
  root.userData.vials = vials;
  root.userData.cosmic = cosmic;
  root.userData.glassMats = glassMats;
  root.userData.applyEnvMap = (env: THREE.Texture | null) => {
    for (const m of glassMats) {
      m.envMap = env;
      m.needsUpdate = true;
    }
    getBottleControls(prop).applyEnvMap(env);
  };
  return root;
}

function createVial(id: IngredientId, glassMats: THREE.MeshPhysicalMaterial[]) {
  const g = new THREE.Group();
  const accent = new THREE.Color(INGREDIENTS[id].accent);
  const bodyMat = glassMat();
  glassMats.push(bodyMat);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.38, 24), bodyMat);
  body.position.y = 0.05;
  g.add(body);

  const fluid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 0.2, 20),
    new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.85,
      roughness: 0.25,
    }),
  );
  fluid.position.y = -0.02;
  fluid.name = "fluid";
  g.add(fluid);

  const stopper = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.06, 0.07, 16),
    new THREE.MeshStandardMaterial({ color: 0xc4beb2, metalness: 0.55, roughness: 0.3 }),
  );
  stopper.position.y = 0.28;
  g.add(stopper);

  return g;
}

export function tickLabScene(
  lab: THREE.Group,
  t: number,
  selected: IngredientId[],
  accentHex: string,
) {
  const flask = lab.userData.flask as THREE.Group;
  const vials = lab.userData.vials as THREE.Group;
  const cosmic = lab.userData.cosmic as { uniforms: { uColor: { value: THREE.Color }; uTime: { value: number } } };

  if (flask) {
    flask.rotation.y = Math.sin(t * 0.22) * 0.08;
  }
  if (cosmic) {
    cosmic.uniforms.uTime.value = t;
    cosmic.uniforms.uColor.value.lerp(new THREE.Color(accentHex), 0.08);
  }

  vials?.children.forEach((v, i) => {
    const id = v.userData.ingredient as IngredientId;
    const on = selected.includes(id);
    v.position.y = 0.78 + (on ? 0.08 : 0) + Math.sin(t * 1.2 + i) * 0.01;
    const fluid = v.getObjectByName("fluid") as THREE.Mesh | undefined;
    if (fluid && fluid.material instanceof THREE.MeshStandardMaterial) {
      fluid.material.emissiveIntensity = on ? 1.2 : 0.45;
    }
    v.scale.setScalar(on ? 1.1 : 1);
  });
}
