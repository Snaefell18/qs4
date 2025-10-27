import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Kein Bild angegeben" }), { status: 400 });
    }

    const data = await resend.emails.send({
      from: "Wechselkurse App <onboarding@resend.dev>",
      to: "jan.rentzsch@googlemail.com",
      subject: "Neuer WSJ-Wechselkurs-Screenshot",
      html: `
        <p>Hallo Jan,</p>
        <p>anbei der automatisch erzeugte Screenshot der WSJ-Wechselkurse.</p>
        <p><a href="${imageUrl}" target="_blank">Bild hier ansehen</a></p>
        <img src="${imageUrl}" alt="WSJ Screenshot" style="max-width:600px;border:1px solid #ccc;border-radius:8px;">
        <p>Viele Grüße,<br>Deine Wechselkurs-App</p>
      `,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Fehler beim Senden der Mail" }), { status: 500 });
  }
}
