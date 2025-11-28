import Link from "next/link";

export default function CategoryList({
  state,
  zone,
  categories,
}: {
  state: string;
  zone: string;
  categories: string[];
}) {
  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/projects/${encodeURIComponent(state)}/${encodeURIComponent(
            zone
          )}/${encodeURIComponent(cat)}`}
          className="block p-3 bg-white rounded shadow border hover:bg-gray-50"
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
