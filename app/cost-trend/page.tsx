"use client";

export default function CostTrendPage() {
  const goToState = (state: string) => {
    window.location.href = `/cost-trend/${state.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-black text-center">Please select a state</h1>

      <div className="flex gap-6">
        {["LAGOS", "ABUJA"].map((state) => (
          <button
            key={state}
            onClick={() => goToState(state)}
            className="bg-gray-300 rounded-xl w-48 h-48 flex items-center justify-center 
                       text-center text-black font-semibold text-lg 
                       hover:bg-black hover:text-white transition-colors duration-300 shadow-lg"
          >
            {state}
          </button>
        ))}
      </div>
    </div>
  );
}
