"use client";

interface CategoryCardProps {
  title: string;
  onClick: () => void;
}

export default function CategoryCard({ title, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-300 hover:bg-black text-black hover:text-white cursor-pointer rounded-2xl w-72 h-72 flex items-center justify-center text-center font-bold text-xl shadow-lg transition-colors duration-300"
    >
      {title}
    </div>
  );
}
