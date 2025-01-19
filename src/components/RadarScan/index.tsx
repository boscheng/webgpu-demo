import { useRef } from "react";

const RadarScan = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="radarScan">
      <h1>RadarScan</h1>
      <canvas
        ref={canvasRef}
        style={{ width: "800px", height: "800px" }}
      ></canvas>
    </div>
  );
};

export default RadarScan;
