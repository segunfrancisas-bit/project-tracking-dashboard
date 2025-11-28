import Link from "next/link";

export default function StateList({ states }: { states: string[] }) {
  return (
    <div className="space-y-3">
      {states.map((state) => (
        <Link
          key={state}
          href={`/projects/${encodeURIComponent(state)}`}
          className="block p-3 bg-white rounded shadow border hover:bg-gray-50"
        >
          {state}
        </Link>
      ))}
    </div>
  );
}
