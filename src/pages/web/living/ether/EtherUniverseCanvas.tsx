import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createUniverseMaterial, chapterMode, type ShaderUniverseState } from "./shaderUniverse";

type Props = {
  state: ShaderUniverseState;
  className?: string;
};

export function EtherUniverseCanvas({ state, className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x050505, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mat = createUniverseMaterial();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    const pointer = new THREE.Vector2();
    const pointerSmooth = new THREE.Vector2();
    const modeSmooth = { v: 0 };

    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    mount.addEventListener("pointermove", onMove);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      mat.uniforms.uRes.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      const st = stateRef.current;
      pointerSmooth.lerp(pointer, 0.06);
      modeSmooth.v += (chapterMode(st.chapter) - modeSmooth.v) * 0.04;

      const u = mat.uniforms;
      u.uTime.value = t;
      u.uMouse.value.copy(pointerSmooth);
      u.uMode.value = modeSmooth.v;
      u.uLocal.value = st.local;
      u.uHover.value += (st.hoverEnergy - u.uHover.value) * 0.1;
      u.uSelect.value += (st.selectEnergy - u.uSelect.value) * 0.08;
      u.uDry.value = st.drydown;
      u.uReveal.value = st.reveal;
      u.uLab.value += (st.labEnergy - u.uLab.value) * 0.1;
      u.uMatch.value += (st.matchBias - u.uMatch.value) * 0.08;
      u.uAccent.value.lerp(new THREE.Color(st.accent), 0.05);
      u.uFocus.value.lerp(new THREE.Color(st.focusAccent), 0.08);
      u.uDna0.value = st.dna.calmPower;
      u.uDna1.value = st.dna.dayNight;
      u.uDna2.value = st.dna.freshWarm;
      u.uDna3.value = st.dna.minimalSensual;
      u.uDna4.value = st.dna.lightDark;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointermove", onMove);
      mat.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
      aria-hidden
    />
  );
}

export type { ShaderUniverseState as UniverseState };
