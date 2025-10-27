"use client";
import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [error, setError] = useState(null);

  async function handleScreenshot() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/screenshot");
      const data = await res.json();
      if (!res.ok || !data?.imageUrl) throw new Error(data?.error || "Screenshot fehlgeschlagen");
      setImageUrl(data.imageUrl);
      setMessage(null);
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
      setMessage("✅ Screenshot erfolgreich ans Controlling gesendet!");
    } catch (err) {
      setMessage("❌ Fehler beim Mailversand.");
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

        {/* Neuer Button */}
        <button
          className="button"
          style={{
            backgroundColor: imageUrl ? "#333" : "#999",
            cursor: imageUrl ? "pointer" : "not-allowed",
            opacity: sending ? 0.7 : 1,
          }}
          onClick={handleSendEmail}
          disabled={!imageUrl || sending}
        >
          {sending ? "Wird gesendet..." : "Ans Controlling übertragen"}
        </button>

        {error && <div style={{ color: "#b91c1c", marginTop: 16 }}>{error}</div>}
        {message && <div style={{ color: "#047857", marginTop: 16 }}>{message}</div>}

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
