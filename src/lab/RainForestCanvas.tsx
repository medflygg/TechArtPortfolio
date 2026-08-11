import { useEffect, useRef } from "react";
import type { RainForestParams } from "../shaders/rainForestParams";
import { RainForestRunner } from "./rainForestRunner";

type Props = {
  bufferA: string;
  image: string;
  params: RainForestParams;
  onError?: (message: string | null) => void;
};

export function RainForestCanvas({ bufferA, image, params, onError }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<RainForestRunner | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    let unbind: (() => void) | undefined;

    try {
      const runner = new RainForestRunner(canvas);
      runnerRef.current = runner;
      runner.setParams(params);
      runner.setSources({ bufferA, image });
      unbind = runner.bindPointer(canvas);
      runner.startLoop(onError);
      onError?.(null);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Failed to init Rain Forest");
    }

    return () => {
      unbind?.();
      runnerRef.current?.dispose();
      runnerRef.current = null;
      if (canvas.parentElement === mount) mount.removeChild(canvas);
    };
    // Recompile only when shader sources change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bufferA, image, onError]);

  useEffect(() => {
    runnerRef.current?.setParams(params);
  }, [params]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
