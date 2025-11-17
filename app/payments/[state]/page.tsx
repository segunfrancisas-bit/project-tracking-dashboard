"use client";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const { state } = params as { state: string };

  const goToCategory = (category: string) => {
    window.location.href = `/payments/${state}/${category}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-8 text-black">Please select a category</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["cash-mobilization", "milestone-payment"].map((cat) => (
            <button
              key={cat}
              onClick={() => goToCategory(cat)}
              className="bg-gray-300 rounded-xl w-64 h-48 flex items-center justify-center
                         text-center text-black font-semibold text-lg
                         hover:bg-black hover:text-white transition-colors duration-300 shadow-lg"
            >
              {cat.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </div>
      </main>

      {/* Footer (sticky at bottom correctly) */}
      <footer className="bg-gray-200 shadow-inner p-4 text-center text-sm text-gray-700">
        © Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          className="hover:text-black transition"
          style={{ textDecoration: "none" }}
        >
          C.Boaz🌴
        </a>
      </footer>
    </div>
  );
}
