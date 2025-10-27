"use client";
import { useState } from "react";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/screenshot");
    const data = await res.json();
    setImageUrl(data.imageUrl);
    setLoading(false);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="flex flex-col items-center justify-center w-full max-w-3xl">
        {/* Titelbild */}
        <img
          src="/titel.png"
          alt="Wechselkurse-Screenshot-App"
          className="w-full max-w-xl h-auto object-contain mb-10"
        />

        {/* Button */}
        <button
          onClick={handleClick}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md mb-10 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Lädt..." : "Screenshot laden"}
        </button>

        {/* Screenshot-Vorschau */}
        {imageUrl && (
          <div className="cursor-zoom-in flex justify-center">
            <img
              src={imageUrl}
              alt="Screenshot"
              onClick={() => setShowFull(true)}
              className="max-w-sm sm:max-w-md rounded-lg shadow-lg transition-transform hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Vollbildansicht */}
      {showFull && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setShowFull(false)}
        >
          <img
            src={imageUrl}
            alt="Screenshot groß"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
          />
        </div>
      )}
    </main>
  );
}
