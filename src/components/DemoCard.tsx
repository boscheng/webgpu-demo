import Link from "next/link";

export default function DemoCard({
  demo,
}: {
  demo: { id: string; title: string; description: string; image: string };
}) {
  return (
    <Link href={`/demo/${demo.id}`}>
      <div className="border rounded p-4 hover:shadow-md">
        <img
          src={demo.image}
          alt={demo.title}
          className="w-full h-40 object-cover"
        />
        <h2 className="text-xl font-bold mt-2">{demo.title}</h2>
        <p className="text-gray-600">{demo.description}</p>
      </div>
    </Link>
  );
}
