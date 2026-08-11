import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { materialVertex } from "../shaders/materialSources";

export type MeshKind = "sphere" | "cube" | "plane";

type Props = {
  fragment: string;
  mesh: MeshKind;
  autoRotate?: boolean;
  /** Screen-space silhouette outline (mask dilate) — no normal extrusion */
  silhouetteOutline?: boolean;
  onError?: (message: string | null) => void;
};

const MASK_VERT = /* glsl */ `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const MASK_FRAG = /* glsl */ `
void main() {
  gl_FragColor = vec4(1.0);
}
`;

const COMPOSITE_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const COMPOSITE_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tMask;
uniform vec2 uResolution;
uniform float uPx;
uniform vec3 uBg;
uniform vec3 uFill;
uniform vec3 uOutline;
varying vec2 vUv;

float maskAt(vec2 uv) {
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  return texture2D(tMask, uv).r;
}

void main() {
  vec2 texel = 1.0 / uResolution;
  float m = maskAt(vUv);

  // Screen-space dilate — silhouette thickness in pixels, independent of mesh normals
  float dilated = m;
  for (int i = 0; i < 16; i++) {
    float a = float(i) * 6.28318530718 / 16.0;
    vec2 dir = vec2(cos(a), sin(a));
    dilated = max(dilated, maskAt(vUv + dir * uPx * texel));
    dilated = max(dilated, maskAt(vUv + dir * uPx * 0.5 * texel));
  }

  vec3 col = uBg;
  if (dilated > 0.5 && m < 0.5) col = uOutline;
  else if (m > 0.5) col = uFill;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function MaterialPreviewCanvas({
  fragment,
  mesh,
  autoRotate = false,
  silhouetteOutline = false,
  onError,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0c0f, 1);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 3.35);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 1.6;
    controls.maxDistance = 8;
    controls.target.set(0, 0, 0);
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.4;
    controls.update();

    const uniforms = {
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(0.45, 0.8, 0.35).normalize() },
    };

    const geo =
      mesh === "cube"
        ? new THREE.BoxGeometry(1.25, 1.25, 1.25)
        : mesh === "plane"
          ? new THREE.PlaneGeometry(2.2, 2.2, 64, 64)
          : new THREE.SphereGeometry(0.9, 64, 64);

    const root = new THREE.Group();
    if (mesh === "plane") root.rotation.x = -Math.PI * 0.12;
    scene.add(root);

    let material: THREE.Material;
    let maskMat: THREE.ShaderMaterial | null = null;
    let maskRT: THREE.WebGLRenderTarget | null = null;
    let compositeScene: THREE.Scene | null = null;
    let compositeCam: THREE.OrthographicCamera | null = null;
    let compositeMat: THREE.ShaderMaterial | null = null;
    let grid: THREE.GridHelper | null = null;

    try {
      if (silhouetteOutline) {
        // Guaranteed unlit white — no lights, no custom shading path
        material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        maskMat = new THREE.ShaderMaterial({
          vertexShader: MASK_VERT,
          fragmentShader: MASK_FRAG,
          depthTest: true,
          depthWrite: true,
        });
        maskRT = new THREE.WebGLRenderTarget(1, 1, {
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
        });
        compositeMat = new THREE.ShaderMaterial({
          vertexShader: COMPOSITE_VERT,
          fragmentShader: COMPOSITE_FRAG,
          depthTest: false,
          depthWrite: false,
          uniforms: {
            tMask: { value: maskRT.texture },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uPx: { value: 4.0 },
            uBg: { value: new THREE.Color(0xc9b08a) },
            uFill: { value: new THREE.Color(0xffffff) },
            uOutline: { value: new THREE.Color(0x000000) },
          },
        });
        compositeScene = new THREE.Scene();
        compositeCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compositeMat);
        compositeScene.add(quad);
      } else {
        material = new THREE.ShaderMaterial({
          vertexShader: materialVertex,
          fragmentShader: fragment,
          uniforms,
        });
        grid = new THREE.GridHelper(6, 12, 0x2a3038, 0x1a1e24);
        grid.position.y = -1.05;
        scene.add(grid);
      }
      onError?.(null);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Material compile failed");
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      return;
    }

    const object = new THREE.Mesh(geo, material);
    root.add(object);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (maskRT && compositeMat) {
        const pr = renderer.getPixelRatio();
        maskRT.setSize(Math.max(1, Math.floor(w * pr)), Math.max(1, Math.floor(h * pr)));
        compositeMat.uniforms.uResolution.value.set(maskRT.width, maskRT.height);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let frame = 0;
    const start = performance.now();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const t = (performance.now() - start) / 1000;
      uniforms.uTime.value = t;
      controls.autoRotate = autoRotateRef.current;
      controls.update();

      if (silhouetteOutline && maskRT && maskMat && compositeScene && compositeCam) {
        const prevMat = object.material;
        object.material = maskMat;
        renderer.setRenderTarget(maskRT);
        renderer.setClearColor(0x000000, 1);
        renderer.clear();
        renderer.render(scene, camera);
        object.material = prevMat;

        renderer.setRenderTarget(null);
        renderer.render(compositeScene, compositeCam);
      } else {
        renderer.setClearColor(0x0a0c0f, 1);
        renderer.render(scene, camera);
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      controls.dispose();
      material.dispose();
      maskMat?.dispose();
      maskRT?.dispose();
      compositeMat?.dispose();
      if (compositeScene) {
        compositeScene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
          }
        });
      }
      geo.dispose();
      if (grid) {
        grid.geometry.dispose();
        const gm = grid.material;
        if (Array.isArray(gm)) gm.forEach((m) => m.dispose());
        else gm.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [fragment, mesh, silhouetteOutline, onError]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
