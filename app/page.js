"use client";
import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);

  // Einstellungen
  const [months, setMonths] = useState(["1", "4", "7", "10"]); // Standard Quartale
  const [email, setEmail] = useState("a.minardi@web.de");

  const monthNames = {
    1: "Januar",
    2: "Februar",
    3: "März",
    4: "April",
    5: "Mai",
    6: "Juni",
    7: "Juli",
    8: "August",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Dezember",
  };

  async function handleScreenshot() {
    try {
      setLoading(true);
      setError(null);
      setSent(false);
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
      setSent(true);
    } catch (err) {
      setError("Fehler beim Mailversand.");
    } finally {
      setSending(false);
    }
  }

  // Monat ändern
  function toggleMonth(num) {
    setMonths((prev) =>
      prev.includes(num) ? prev.filter((m) => m !== num) : [...prev, num]
    );
  }

  return (
    <main className="page">
      <div className="container fade-in">
        <img src="/titel.png" alt="Wechselkurse-Screenshot-App" className="title-image" />

        {/* Screenshot laden */}
        <button className="button" onClick={handleScreenshot} disabled={loading}>
          {loading ? "Lädt..." : "WSJ-Wechselkurse laden"}
        </button>

        {/* Mail senden */}
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

{/* Einstellungen */}
<button
  onClick={() => setShowSettings(true)}
  className="button"
  style={{ marginTop: "12px" }}
>
  Einstellungen
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

        {/* Screenshot Vollbild */}
        {showFull && imageUrl && (
          <div className="modal" onClick={() => setShowFull(false)}>
            <img src={imageUrl} alt="Screenshot groß" />
          </div>
        )}

        {/* Einstellungs-Modal */}
        {showSettings && (
          <div className="modal" onClick={() => setShowSettings(false)}>
            <div
              className="settings-box fade-in"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "12px",
                width: "min(90vw, 600px)",
                maxHeight: "90vh",
                overflowY: "auto",
                textAlign: "left",
              }}
            >
              <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Einstellungen</h2>

              <label style={{ fontWeight: "bold" }}>Automatisch senden im:</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "6px",
                  marginBottom: "20px",
                  marginTop: "8px",
                }}
              >
                {Object.entries(monthNames).map(([num, name]) => (
                  <label key={num}>
                    <input
                      type="checkbox"
                      checked={months.includes(num)}
                      onChange={() => toggleMonth(num)}
                    />{" "}
                    {name}
                  </label>
                ))}
              </div>

              <label style={{ fontWeight: "bold" }}>Empfängeradresse:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "6px",
                  marginBottom: "20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                }}
              />

<label style={{ fontWeight: "bold" }}>Quelle:</label>
<input
  type="text"
  readOnly
  value="https://www.wsj.com/market-data/currencies/exchangerates"
  style={{
    width: "100%",
    padding: "8px",
    marginTop: "6px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    background: "#f9fafb",
    color: "#111",
    fontFamily: "monospace",
  }}
/>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  onClick={() => setShowSettings(false)}
                  className="button"
                  style={{
                    backgroundColor: "#111",
                    color: "#fff",
                    marginTop: "10px",
                  }}
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
