import Link from "next/link";

export default function Sidebar({
  demos,
}: {
  demos: { id: string; title: string }[];
}) {
  return (
    <aside className="w-64 p-4 border-l">
      <h2 className="text-xl font-bold mb-4">Other Demos</h2>
      <ul>
        {demos.map((demo) => (
          <li key={demo.id} className="mb-2">
            <Link
              href={`/demo/${demo.id}`}
              className="text-blue-500 hover:underline"
            >
              {demo.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
