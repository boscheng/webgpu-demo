import { useEffect, useRef } from "react";
import { initWebGPU } from "./initWebGPU";

const Pyramid = () => {
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
    <div className="pyramid">
      <h1>3D Pyramid</h1>
      <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  );
};

export default Pyramid;
