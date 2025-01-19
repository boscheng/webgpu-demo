import DemoCard from "@/components/DemoCard";
const demos = [
  {
    id: "Triangle",
    title: "Triangle",
    description: "Description for Demo Triangle",
    image: "/demo/triangle.png",
  },
  {
    id: "Pyramid",
    title: "Pyramid",
    description: "Description for Demo Pyramid",
    image: "/demo/Pyramid.gif",
  },
  {
    id: "RadarScan",
    title: "RadarScan",
    description: "Description for RadarScan",
    image: "/demo/demo2.gif",
  },
  {
    id: "cnn",
    title: "WebGPU CNN Test",
    description: "WebGPU CNN Test",
    image: "/demo/cnn.png",
  },
];

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Demo Showcase</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demos.map((demo) => (
          <DemoCard key={demo.id} demo={demo} />
        ))}
      </div>
    </main>
  );
}
