import * as THREE from "three";

function circleTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Dual field: background stars (no magnet) + near dust (soft attract only).
 */
export function createScentField(nearCount = 180, farCount = 280, color = "#6B4EFF") {
  const total = nearCount + farCount;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(total * 3);
  const seed = new Float32Array(total);
  const layer = new Float32Array(total); // 0 = far, 1 = near

  for (let i = 0; i < total; i++) {
    const near = i < nearCount;
    layer[i] = near ? 1 : 0;
    seed[i] = Math.random() * Math.PI * 2;
    if (near) {
      // Front volume around bottle / camera mid
      pos[i * 3] = (Math.random() - 0.5) * 3.2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.2 + 0.4;
    } else {
      // Distant backdrop — no interaction
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = -4 - Math.random() * 8;
    }
  }

  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  geo.setAttribute("aLayer", new THREE.BufferAttribute(layer, 1));

  const mat = new THREE.PointsMaterial({
    color: new THREE.Color(color),
    map: circleTexture(),
    size: 0.055,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    alphaTest: 0.01,
  });

  const pts = new THREE.Points(geo, mat);
  pts.name = "scentField";
  pts.frustumCulled = false;
  pts.userData.home = pos.slice();
  pts.userData.nearCount = nearCount;
  return pts;
}

const _cursor = new THREE.Vector3();
const _ndc = new THREE.Vector3();

export function tickScentField(
  field: THREE.Points,
  t: number,
  pointer: THREE.Vector2,
  camera: THREE.Camera,
  intensity = 1,
  color?: string,
) {
  if (color && field.material instanceof THREE.PointsMaterial) {
    field.material.color.lerp(new THREE.Color(color), 0.04);
    field.material.opacity = 0.12 + intensity * 0.12;
    field.material.size = 0.04 + intensity * 0.018;
  }

  // Cursor on a plane in front of camera (same space as near particles)
  _ndc.set(pointer.x, pointer.y, 0.55);
  _ndc.unproject(camera);
  const camPos = camera.position;
  const dir = _ndc.sub(camPos).normalize();
  // Intersect approx plane z ≈ 0.4 (near field depth)
  const planeZ = 0.4;
  const tHit = Math.abs(dir.z) > 0.001 ? (planeZ - camPos.z) / dir.z : 2.5;
  _cursor.copy(camPos).addScaledVector(dir, THREE.MathUtils.clamp(tHit, 0.8, 6));

  const pos = field.geometry.attributes.position as THREE.BufferAttribute;
  const seed = field.geometry.getAttribute("aSeed") as THREE.BufferAttribute;
  const layers = field.geometry.getAttribute("aLayer") as THREE.BufferAttribute;
  const home = field.userData.home as Float32Array;
  const radius = 1.15; // only within this distance from cursor
  const maxPull = 0.28; // clamp offset so they don't overshoot/flee

  for (let i = 0; i < pos.count; i++) {
    const s = seed.getX(i);
    const isNear = layers.getX(i) > 0.5;
    const hx = home[i * 3];
    const hy = home[i * 3 + 1];
    const hz = home[i * 3 + 2];

    if (!isNear) {
      // Background: slow drift only
      const sp = 0.04;
      pos.setXYZ(
        i,
        hx + Math.sin(t * sp + s) * 0.08,
        hy + Math.cos(t * sp * 0.7 + s) * 0.06,
        hz,
      );
      continue;
    }

    const driftX = Math.sin(t * 0.14 + s) * 0.1;
    const driftY = Math.cos(t * 0.12 + s * 1.2) * 0.08;
    const driftZ = Math.sin(t * 0.1 + s * 0.6) * 0.08;

    let x = hx + driftX;
    let y = hy + driftY;
    let z = hz + driftZ;

    const dx = _cursor.x - x;
    const dy = _cursor.y - y;
    const dz = _cursor.z - z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < radius && dist > 0.001) {
      // Soft attract: weight 1 at center → 0 at edge (never repulsive)
      const w = (1 - dist / radius) ** 2;
      const pull = w * 0.1 * intensity;
      x += (dx / dist) * pull;
      y += (dy / dist) * pull;
      z += (dz / dist) * pull * 0.5;

      // Spring clamp toward home so they don't leave neighborhood
      const ox = x - hx;
      const oy = y - hy;
      const oz = z - hz;
      const oLen = Math.sqrt(ox * ox + oy * oy + oz * oz);
      if (oLen > maxPull) {
        const sClamp = maxPull / oLen;
        x = hx + ox * sClamp;
        y = hy + oy * sClamp;
        z = hz + oz * sClamp;
      }
    }

    pos.setXYZ(i, x, y, z);
  }
  pos.needsUpdate = true;
}
