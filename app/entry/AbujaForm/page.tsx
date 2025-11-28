"use client";

export const dynamic = "force-dynamic";

import ProjectForm from "../../components/ProjectForm";

export default function AbujaFormPage() {
  return (
    <div className="min-h-screen flex justify-center items-start text-black p-8 bg-gray-100">
      <ProjectForm state="Abuja" />
    </div>
  );
}
