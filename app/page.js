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
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-center">
      {/* Header-Bild */}
      <img
        src="/titel.png"
        alt="Wechselkurse-Screenshot-App"
        className="max-w-md mb-6"
      />

      {/* Button */}
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition mb-8"
        disabled={loading}
      >
        {loading ? "Lädt..." : "Screenshot laden"}
      </button>

      {/* Screenshot-Anzeige */}
      {imageUrl && (
        <div className="mt-8">
          <img
            src={imageUrl}
            alt="Screenshot"
            className="max-w-full border rounded shadow-md"
          />
        </div>
      )}
    </main>
  );
}
