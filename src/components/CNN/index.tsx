import { useRef } from "react";
import { main } from "./main";

const CNN = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onStart = () => {
    if (!canvasRef.current || !navigator.gpu) {
      return;
    }
    main();
  };

  return (
    <div className="cnn">
      <h1>WebGPU CNN Test</h1>
      <canvas ref={canvasRef}></canvas>
      <button onClick={onStart}>Run</button>
    </div>
  );
};

export default CNN;
