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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      {/* Titelbild */}
      <img
        src="/titel.png"
        alt="Wechselkurse-Screenshot-App"
        className="w-full max-w-lg h-auto mb-10 object-contain"
      />

      {/* Button */}
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition mb-10 shadow-md disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Lädt..." : "Screenshot laden"}
      </button>

      {/* Screenshot-Vorschau */}
      {imageUrl && (
        <div className="mt-4 cursor-zoom-in">
          <img
            src={imageUrl}
            alt="Screenshot"
            onClick={() => setShowFull(true)}
            className="max-w-xs sm:max-w-md rounded shadow-lg transition-transform hover:scale-105"
          />
        </div>
      )}

      {/* Vollbild-Ansicht */}
      {showFull && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
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
