import * as THREE from "three";
import { type IngredientId, INGREDIENTS } from "./etherWorld";

/** Cleaner AD forms — readable molecules, not chaotic assemblies. */
export function createIngredientForm(id: IngredientId, scale = 1): THREE.Group {
  const g = new THREE.Group();
  g.name = `ing-${id}`;
  g.userData.ingredient = id;
  g.userData.baseScale = scale;
  const accent = new THREE.Color(INGREDIENTS[id].accent);

  if (id === "bergamot") {
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: accent,
        transmission: 0.65,
        thickness: 0.5,
        roughness: 0.12,
        transparent: true,
        opacity: 0.5,
        emissive: accent,
        emissiveIntensity: 0.2,
      }),
    );
    g.add(shell);
    for (let i = 0; i < 6; i++) {
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 10, 10),
        new THREE.MeshStandardMaterial({
          color: 0xeae6dd,
          emissive: accent,
          emissiveIntensity: 1.1,
        }),
      );
      const a = (i / 6) * Math.PI * 2;
      cap.position.set(Math.cos(a) * 0.14, Math.sin(a * 2) * 0.08, Math.sin(a) * 0.14);
      g.add(cap);
    }
  } else if (id === "rose") {
    for (let i = 0; i < 5; i++) {
      const petal = new THREE.Mesh(
        new THREE.CircleGeometry(0.16, 20),
        new THREE.MeshPhysicalMaterial({
          color: 0x14060a,
          transparent: true,
          opacity: 0.72,
          side: THREE.DoubleSide,
          emissive: accent,
          emissiveIntensity: 0.15,
          roughness: 0.4,
        }),
      );
      petal.rotation.y = (i / 5) * Math.PI * 2;
      petal.rotation.x = 0.55;
      petal.position.y = 0.02 * i;
      g.add(petal);
    }
    g.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.7 }),
      ),
    );
  } else if (id === "oud") {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.07, 0.55, 8),
      new THREE.MeshStandardMaterial({ color: 0x1a120e, roughness: 0.88 }),
    );
    trunk.rotation.z = 0.25;
    g.add(trunk);
    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.04, 0.35, 6),
      new THREE.MeshStandardMaterial({ color: 0x221810, roughness: 0.9 }),
    );
    branch.position.set(0.08, 0.12, 0);
    branch.rotation.z = -0.7;
    g.add(branch);
  } else if (id === "vanilla") {
    for (let i = 0; i < 7; i++) {
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.055, 0),
        new THREE.MeshPhysicalMaterial({
          color: accent,
          emissive: accent,
          emissiveIntensity: 0.5,
          roughness: 0.18,
          metalness: 0.25,
        }),
      );
      const a = (i / 7) * Math.PI * 2;
      crystal.position.set(Math.cos(a) * 0.16, (i % 3) * 0.08 - 0.08, Math.sin(a) * 0.16);
      crystal.rotation.set(0.4, a, 0.2);
      g.add(crystal);
    }
  } else if (id === "iris") {
    g.add(
      new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.14, 0.035, 64, 12, 2, 3),
        new THREE.MeshPhysicalMaterial({
          color: accent,
          emissive: accent,
          emissiveIntensity: 0.4,
          roughness: 0.22,
          transmission: 0.35,
          transparent: true,
          opacity: 0.85,
        }),
      ),
    );
  } else if (id === "pepper") {
    for (let i = 0; i < 5; i++) {
      const berry = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshStandardMaterial({
          color: accent,
          emissive: accent,
          emissiveIntensity: 0.55,
        }),
      );
      const a = (i / 5) * Math.PI * 2;
      berry.position.set(Math.cos(a) * 0.12, Math.sin(a) * 0.06, Math.sin(a) * 0.12);
      g.add(berry);
    }
  } else {
    g.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 24, 24),
        new THREE.MeshPhysicalMaterial({
          color: accent,
          transparent: true,
          opacity: 0.4,
          roughness: 0.55,
          transmission: 0.45,
          emissive: accent,
          emissiveIntensity: 0.25,
        }),
      ),
    );
  }

  g.scale.setScalar(scale);
  return g;
}

export function tickIngredientForm(g: THREE.Object3D, t: number, hot: boolean) {
  const base = (g.userData.baseScale as number) || 1;
  const breath = 1 + Math.sin(t * 1.2 + (g.userData.phase || 0)) * 0.02;
  g.rotation.y = (g.userData.homeRotY || 0) + t * (hot ? 0.35 : 0.12);
  const s = base * breath * (hot ? 1.12 : 1);
  g.scale.setScalar(s);
}
