import { useEffect, useRef } from "react";
import { initWebGPU } from "./initWebGPU";

const Triangle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current || !navigator.gpu) {
      return;
    }
    if (canvasRef.current) {
      initWebGPU(canvasRef.current);
    }
  }, []);
  return (
    <div className="triangle">
      <h1>Base Triangle</h1>
      <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  );
};

export default Triangle;
