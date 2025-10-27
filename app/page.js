"use client";
import { useState } from "react";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/screenshot");
    const data = await res.json();
    setImageUrl(data.imageUrl);
    setLoading(false);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-4">Microlink Screenshot App</h1>
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Lädt..." : "Screenshot laden"}
      </button>
      {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt="Screenshot" className="max-w-full border rounded" />
        </div>
      )}
    </main>
  );
}
