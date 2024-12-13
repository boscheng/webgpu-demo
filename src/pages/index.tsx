import DemoCard from "@/components/DemoCard";
const demos = [
  {
    id: "demo1",
    title: "Demo 1",
    description: "Description for Demo 1",
    image: "/demo/demo1.gif",
  },
  {
    id: "demo2",
    title: "Demo 2",
    description: "Description for Demo 2",
    image: "/demo/demo2.gif",
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
