import Link from "next/link";
import Image from "next/image";

export default function DemoCard({
  demo,
}: {
  demo: { id: string; title: string; description: string; image: string };
}) {
  return (
    <Link href={`/demo/${demo.id}`}>
      <div className="border rounded p-4 hover:shadow-md">
        <Image
          src={demo.image}
          alt={demo.title}
          width={500}
          height={300}
          className="w-full h-60 object-cover"
        />
        <h2 className="text-xl font-bold mt-2">{demo.title}</h2>
        <p className="text-gray-600">{demo.description}</p>
      </div>
    </Link>
  );
}
