"use client";

import React from "react";

interface CategoryCardProps {
  title: string;
  description?: string;
  onClick: () => void;
}

export default function CategoryCard({ title, description, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      className="cursor-pointer bg-white shadow-lg rounded-2xl p-10 flex flex-col justify-center items-center hover:scale-105 transition-transform duration-300 border border-gray-200 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-2 text-black">{title}</h2>
      {description && <p className="text-black/80 text-sm text-center">{description}</p>}
    </div>
  );
}
