import * as THREE from "three";
import { type IngredientId, INGREDIENTS, type Origin, ORIGINS, latLonToVec } from "./etherWorld";

function circleTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Black Earth — thin atmosphere, faint continents, glowing origin pins. */
export function createDarkGlobe() {
  const g = new THREE.Group();
  g.name = "globe";

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 96, 96),
    new THREE.MeshStandardMaterial({
      color: 0x0c0c0c,
      roughness: 0.92,
      metalness: 0.08,
      emissive: 0x1a2228,
      emissiveIntensity: 0.22,
    }),
  );
  g.add(earth);

  const landCount = 900;
  const landPos = new Float32Array(landCount * 3);
  let wrote = 0;
  while (wrote < landCount) {
    const lat = (Math.random() - 0.5) * 140;
    const lon = (Math.random() - 0.5) * 360;
    if (Math.abs(lat) > 68 && Math.random() > 0.25) continue;
    const v = latLonToVec(lat, lon, 1.552);
    landPos[wrote * 3] = v.x;
    landPos[wrote * 3 + 1] = v.y;
    landPos[wrote * 3 + 2] = v.z;
    wrote++;
  }
  const landGeo = new THREE.BufferGeometry();
  landGeo.setAttribute("position", new THREE.BufferAttribute(landPos, 3));
  g.add(
    new THREE.Points(
      landGeo,
      new THREE.PointsMaterial({
        color: 0x4a4a44,
        map: circleTexture(),
        size: 0.034,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        alphaTest: 0.02,
      }),
    ),
  );

  g.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(1.64, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x8bb8c9,
        transparent: true,
        opacity: 0.09,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    ),
  );

  const grid = new THREE.Mesh(
    new THREE.SphereGeometry(1.56, 36, 24),
    new THREE.MeshBasicMaterial({
      color: 0x6b4eff,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
    }),
  );
  g.add(grid);

  const pins = new THREE.Group();
  pins.name = "pins";
  for (const o of ORIGINS) {
    const v = latLonToVec(o.lat, o.lon, 1.6);
    const pin = new THREE.Group();
    pin.userData.originId = o.id;
    pin.userData.ingredient = o.ingredient;
    pin.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.038, 20, 20),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(INGREDIENTS[o.ingredient].accent),
          emissive: new THREE.Color(INGREDIENTS[o.ingredient].accent),
          emissiveIntensity: 1.4,
        }),
      ),
      new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(INGREDIENTS[o.ingredient].accent),
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
        }),
      ),
    );
    pin.position.set(v.x, v.y, v.z);
    pins.add(pin);
  }
  g.add(pins);

  return g;
}

export function createOriginStream(count = 220) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    seed[i] = Math.random();
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.PointsMaterial({
    color: 0xe0b35a,
    map: circleTexture(),
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    alphaTest: 0.02,
  });
  const pts = new THREE.Points(geo, mat);
  pts.name = "originStream";
  pts.visible = false;
  return pts;
}

export function updateOriginStream(
  stream: THREE.Points,
  from: THREE.Vector3,
  to: THREE.Vector3,
  progress: number,
  accent: string,
  t: number,
) {
  stream.visible = progress > 0.01;
  if (stream.material instanceof THREE.PointsMaterial) {
    stream.material.color.set(accent);
  }
  const pos = stream.geometry.attributes.position as THREE.BufferAttribute;
  const seed = stream.geometry.getAttribute("aSeed") as THREE.BufferAttribute;
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  mid.add(from.clone().normalize().multiplyScalar(1.15));

  for (let i = 0; i < pos.count; i++) {
    const s = seed.getX(i);
    const f = (s * 0.85 + progress * 1.15 + t * 0.04) % 1;
    const inv = 1 - f;
    const x = inv * inv * from.x + 2 * inv * f * mid.x + f * f * to.x;
    const y = inv * inv * from.y + 2 * inv * f * mid.y + f * f * to.y;
    const z = inv * inv * from.z + 2 * inv * f * mid.z + f * f * to.z;
    const spread = Math.sin(f * Math.PI) * 0.08;
    pos.setXYZ(i, x + Math.sin(s * 20) * spread, y + Math.cos(s * 18) * spread * 0.5, z);
  }
  pos.needsUpdate = true;
}

export type { Origin };
export function ingredientAccent(id: IngredientId) {
  return INGREDIENTS[id].accent;
}
