import Link from "next/link";

export default function ZoneList({
  state,
  zones,
}: {
  state: string;
  zones: string[];
}) {
  return (
    <div className="space-y-3">
      {zones.map((zone) => (
        <Link
          key={zone}
          href={`/projects/${encodeURIComponent(state)}/${encodeURIComponent(
            zone
          )}`}
          className="block p-3 bg-white rounded shadow border hover:bg-gray-50"
        >
          {zone}
        </Link>
      ))}
    </div>
  );
}
