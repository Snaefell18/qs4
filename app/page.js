"use client";
import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false); // 👈 neu
  const [showFull, setShowFull] = useState(false);
  const [error, setError] = useState(null);

  async function handleScreenshot() {
    try {
      setLoading(true);
      setError(null);
      setSent(false); // 👈 Reset, falls neu geladen wird
      const res = await fetch("/api/screenshot");
      const data = await res.json();
      if (!res.ok || !data?.imageUrl) throw new Error(data?.error || "Screenshot fehlgeschlagen");
      setImageUrl(data.imageUrl);
    } catch (e) {
      setError(e.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmail() {
    try {
      setSending(true);
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Mailversand fehlgeschlagen");
      setSent(true); // 👈 Erfolgreich → Button deaktivieren & Text ändern
    } catch (err) {
      setError("Fehler beim Mailversand.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="page">
      <div className="container fade-in">
        <img src="/titel.png" alt="Wechselkurse-Screenshot-App" className="title-image" />

        <button className="button" onClick={handleScreenshot} disabled={loading}>
          {loading ? "Lädt..." : "WSJ-Wechselkurse laden"}
        </button>

        {/* Neuer Controlling-Button */}
        <button
          onClick={handleSendEmail}
          disabled={!imageUrl || sending || sent}
          className="button"
          style={{
            backgroundColor: sent ? "#9ca3af" : "#333",
            color: sent ? "#f3f4f6" : "#fff",
            cursor: sent ? "default" : imageUrl ? "pointer" : "not-allowed",
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending
            ? "Wird gesendet..."
            : sent
            ? "Erfolgreich versendet"
            : "Ans Controlling übertragen"}
        </button>

        {error && <div style={{ color: "#b91c1c", marginTop: 16 }}>{error}</div>}

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Screenshot"
            className="screenshot-thumb fade-in"
            onClick={() => setShowFull(true)}
          />
        )}

        {showFull && imageUrl && (
          <div className="modal" onClick={() => setShowFull(false)}>
            <img src={imageUrl} alt="Screenshot groß" />
          </div>
        )}
      </div>
    </main>
  );
}
