import { OrbitControls, Grid } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import PorscheTaycan from "./PorscheTaycan";
import { RadarScan } from "./RadarScan";

const RadarScanTest = () => {
  return (
    <div className="radarScan">
      <h1>RadarScan</h1>
      <Canvas
        style={{ width: "800px", height: "800px" }}
        camera={{ position: [0, 2, 5], fov: 50 }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <PorscheTaycan />
        <group position={[0, -0.5, 0]}>
          <RadarScan radius={2} color="#3DDFEA" speed={0.2} ringCount={3} />
        </group>
        <Grid
          renderOrder={2}
          position={[0, -0.5, 0]}
          infiniteGrid={true}
          cellSize={0.2}
          cellThickness={0.2}
          sectionSize={2}
          sectionThickness={1}
          sectionColor={[0.5, 0.5, 0.5]}
          fadeDistance={30}
        />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};

export default RadarScanTest;
