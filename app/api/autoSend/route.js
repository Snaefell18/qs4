import { Resend } from "resend";

export const runtime = "edge";

// --- Helpers ---
function isWeekend(date) {
  const d = date.getDay();
  return d === 0 || d === 6; // So / Sa
}

// einfache (feste) deutsche Feiertage – bei Bedarf erweitern
function isHoliday(date) {
  const d = date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
  const fixed = [
    "01.01.", // Neujahr
    "01.05.", // Tag der Arbeit
    "03.10.", // Tag der Einheit
    "25.12.", // 1. Weihnachtstag
    "26.12.", // 2. Weihnachtstag
  ];
  return fixed.includes(d);
}

function isFirstWorkingDayAfterQuarterEnd(date) {
  const year = date.getFullYear();
  const quarterEnds = [
    new Date(year, 2, 31),  // 31.03.
    new Date(year, 5, 30),  // 30.06.
    new Date(year, 8, 30),  // 30.09.
    new Date(year, 11, 31), // 31.12.
  ];

  return quarterEnds.some((end) => {
    const next = new Date(end);
    next.setDate(end.getDate() + 1);
    // auf ersten Arbeitstag schieben
    while (isWeekend(next) || isHoliday(next)) {
      next.setDate(next.getDate() + 1);
    }
    return (
      next.getDate() === date.getDate() &&
      next.getMonth() === date.getMonth() &&
      next.getFullYear() === date.getFullYear()
    );
  });
}

// Einmalige Ausführung am 28.10.2025
function isSpecialExecutionDay(date) {
  return date.getDate() === 29 && date.getMonth() === 9 && date.getFullYear() === 2025; // 9 = Oktober
}

export async function GET() {
  try {
    const today = new Date();

    const shouldRun =
      isFirstWorkingDayAfterQuarterEnd(today) || isSpecialExecutionDay(today);

    if (!shouldRun) {
      return new Response("Kein Versandtag heute ✅");
    }

    // Screenshot erzeugen (Microlink)
    const mRes = await fetch(
      "https://api.microlink.io/?url=https://www.wsj.com/market-data/currencies/exchangerates?nocache=233&screenshot=true&meta=false&fullPage=true"
    );
    const mJson = await mRes.json();
    const imageUrl = mJson?.data?.screenshot?.url;
    if (!imageUrl) throw new Error("Screenshot fehlgeschlagen");

    // Datum & Uhrzeit wie beim Button-Mailversand
    const datum = today.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const uhrzeit = today.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const html = `
      <p>Hey Adri,</p>
      <p>hier die WSJ-Wechselkurse vom <strong>${datum}</strong> um <strong>${uhrzeit} Uhr UTC</strong>.</p>
      <p><img src="${imageUrl}" alt="WSJ Screenshot" style="max-width:600px;border:1px solid #ccc;border-radius:8px;margin-top:10px;margin-bottom:10px;"></p>
      <p>Alternativ als Download: <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
      <p>Liebe Grüße</p>
      <p>Jan</p>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Exchange Rates-App <mail@qs4-org.org>",
      to: "a.minardi@euroimmun.de",
      subject: `WSJ-Wechselkurse vom ${datum}`,
      html,
    });

    return new Response("Mail erfolgreich versendet ✅");
  } catch (e) {
    console.error(e);
    return new Response("Fehler beim automatischen Versand ❌", { status: 500 });
  }
}
