"use client";
import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/screenshot");
      const data = await res.json();
      if (!res.ok || !data?.imageUrl) {
        throw new Error(data?.error || "Screenshot fehlgeschlagen");
      }
      setImageUrl(data.imageUrl);
    } catch (e) {
      setError(e.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="container fade-in">
        {/* Titelbild (aus /public/titel.png) */}
        <img
          src="/titel.png"
          alt="Wechselkurse-Screenshot-App"
          className="title-image"
        />

        {/* Button */}
        <button className="button" onClick={handleClick} disabled={loading}>
          {loading ? "Lädt..." : "Screenshot laden"}
        </button>

        {/* Fehleranzeige */}
        {error && <div style={{ color: "#b91c1c", marginBottom: 16 }}>{error}</div>}

        {/* Screenshot (klein) */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Screenshot"
            className="screenshot-thumb fade-in"
            onClick={() => setShowFull(true)}
          />
        )}
      </div>

      {/* Vollbild-Modal */}
      {showFull && imageUrl && (
        <div className="modal" onClick={() => setShowFull(false)}>
          <img src={imageUrl} alt="Screenshot groß" />
        </div>
      )}
    </main>
  );
}
