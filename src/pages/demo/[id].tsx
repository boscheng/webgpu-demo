import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import RadarScan from "@/components/RadarScan";

const demos = [
  { id: "demo1", title: "Demo 1", content: <RadarScan /> },
  { id: "demo2", title: "Demo 2", content: "Detailed content for Demo 2" },
];

export default function DemoDetail() {
  const router = useRouter();
  const { id } = router.query;
  const demo = demos.find((d) => d.id === id);

  if (!demo) return <div>Demo not found!</div>;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{demo.title}</h1>
      <div className="flex">
        <div className="flex-1">{demo.content}</div>
        <Sidebar demos={demos.filter((d) => d.id !== id)} />
      </div>
    </main>
  );
}
