import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Kein Bild angegeben" }), { status: 400 });
    }

    // Aktuelles Datum & Uhrzeit
    const now = new Date();
    const datum = now.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const uhrzeit = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Mail-Inhalt
    const html = `
      <p>Hey Adri,</p>
      <p>hier die WSJ-Wechselkurse vom <strong>${datum}</strong> um <strong>${uhrzeit}</strong>.</p>
      <p><img src="${imageUrl}" alt="WSJ Screenshot" style="max-width:600px;border:1px solid #ccc;border-radius:8px;margin-top:10px;margin-bottom:10px;"></p>
      <p>Alternativ als Download: <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
      <p>Liebe Grüße</p>
      <p>Jan</p>
    `;

    // E-Mail senden
    const data = await resend.emails.send({
      from: "Exchange Rates-App <mail@qs4-org.org>", // dein neuer Domain-Absender
      to: "jn.rentzsch@euroimmun.de", // Standardempfänger
      subject: `WSJ-Wechselkurse vom ${datum}`,
      html,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Fehler beim Senden der Mail" }), { status: 500 });
  }
}
