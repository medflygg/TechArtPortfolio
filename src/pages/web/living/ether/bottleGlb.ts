import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { publicUrl } from "../../../../lib/publicUrl";

export const ETHER_BOTTLE_GLB = publicUrl("portfolio/ether/ether-bottle.glb");

export type BottleGlbHandle = {
  root: THREE.Group;
  setLiquidColor: (hex: string) => void;
  tick: (t: number, pointer: THREE.Vector2) => void;
  dispose: () => void;
};

function tintLiquid(root: THREE.Object3D, hex: string) {
  const color = new THREE.Color(hex);
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const name = (obj.name || "").toLowerCase();
    if (!name.includes("liquid")) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const m of mats) {
      if (!m) continue;
      if ("color" in m && m.color instanceof THREE.Color) m.color.copy(color);
      if ("emissive" in m && m.emissive instanceof THREE.Color) {
        m.emissive.copy(color);
        (m as THREE.MeshStandardMaterial).emissiveIntensity = 0.35;
      }
      m.needsUpdate = true;
    }
  });
}

function applyEnv(root: THREE.Object3D, env: THREE.Texture | null) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const m of mats) {
      if (m && "envMap" in m) {
        (m as THREE.MeshStandardMaterial).envMap = env;
        (m as THREE.MeshStandardMaterial).envMapIntensity = 1.35;
        m.needsUpdate = true;
      }
    }
  });
}

/** Load perfume GLB, normalize to unit height, base near y=0. */
export function loadEtherBottleGlb(
  url: string,
  opts: { targetHeight?: number; liquidHex?: string; envMap?: THREE.Texture | null } = {},
): Promise<BottleGlbHandle> {
  const targetHeight = opts.targetHeight ?? 2.35;
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const root = new THREE.Group();
        root.name = "etherBottleGlb";
        root.add(model);
        model.position.sub(center);

        const scale = targetHeight / Math.max(size.y, 0.001);
        root.scale.setScalar(scale);
        // Base sits on floor plane (~-1.35 in hero scene)
        root.position.y = -1.35 + targetHeight * 0.5;

        if (opts.envMap) applyEnv(root, opts.envMap);
        if (opts.liquidHex) tintLiquid(root, opts.liquidHex);

        const baseRotY = 0.18;
        root.rotation.y = baseRotY;

        resolve({
          root,
          setLiquidColor: (hex) => tintLiquid(root, hex),
          tick: (t, pointer) => {
            root.rotation.y = baseRotY + Math.sin(t * 0.28) * 0.12 + pointer.x * 0.22;
            root.rotation.x = pointer.y * 0.06;
            root.position.x = pointer.x * 0.1;
          },
          dispose: () => {
            root.traverse((obj) => {
              if (obj instanceof THREE.Mesh) {
                obj.geometry?.dispose();
                const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                mats.forEach((m) => m?.dispose());
              }
            });
          },
        });
      },
      undefined,
      (err) => reject(err),
    );
  });
}

export { applyEnv as applyBottleEnvMap };
