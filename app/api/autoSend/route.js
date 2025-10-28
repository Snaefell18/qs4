import { Resend } from "resend";

export const runtime = "edge";

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sonntag oder Samstag
}

// (optional) einfache Liste deutscher Feiertage – du kannst hier beliebig erweitern
function isHoliday(date) {
  const holidays = [
    "01.01.", // Neujahr
    "01.05.", // Tag der Arbeit
    "03.10.", // Tag der Einheit
    "25.12.", // Weihnachten
    "26.12.", // 2. Weihnachtsfeiertag
  ];
  const d = date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
  return holidays.includes(d);
}

// prüft, ob heute der erste Arbeitstag nach Quartalsende ist
function isFirstWorkingDayAfterQuarterEnd(date) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Quartalsenden: 31.3., 30.6., 30.9., 31.12.
  const quarterEndDates = [
    new Date(year, 2, 31),
    new Date(year, 5, 30),
    new Date(year, 8, 30),
    new Date(year, 11, 31),
  ];

  // checke, ob heute direkt nach einem Quartalsende liegt (erster Werktag danach)
  return quarterEndDates.some((endDate) => {
    const next = new Date(endDate);
    next.setDate(endDate.getDate() + 1);
    while (isWeekend(next) || isHoliday(next)) {
      next.setDate(next.getDate() + 1); // schiebe auf nächsten Arbeitstag
    }
    return (
      next.getDate() === date.getDate() &&
      next.getMonth() === date.getMonth() &&
      next.getFullYear() === date.getFullYear()
    );
  });
}

export async function GET() {
  try {
    const today = new Date();

    // nur ausführen, wenn heute der erste Arbeitstag nach Quartalsende
    if (!isFirstWorkingDayAfterQuarterEnd(today)) {
      return new Response("Kein Versandtag heute ✅");
    }

    // Screenshot erzeugen
    const res = await fetch(
      "https://api.microlink.io/?url=https://www.wsj.com/market-data/currencies/exchangerates&screenshot=true&meta=false&fullPage=true"
    );
    const json = await res.json();
    const imageUrl = json?.data?.screenshot?.url;
    if (!imageUrl) throw new Error("Screenshot fehlgeschlagen");

    // Mail vorbereiten
    const resend = new Resend(process.env.RESEND_API_KEY);
    const datum = today.toLocaleDateString("de-DE");

    await resend.emails.send({
      from: "Exchange Rates-App <mail@qs4-org.org>",
      to: "a.minardi@euroimmun.de",
      subject: `WSJ-Wechselkurse vom ${datum}`,
      html: `
        <p>Hey Adri,</p>
        <p>hier die WSJ-Wechselkurse vom ${datum}.</p>
        <p><img src="${imageUrl}" alt="Screenshot" style="max-width:600px;border:1px solid #ccc;border-radius:8px;"></p>
        <p>Alternativ als Download: <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
        <p>Liebe Grüße</p>
        <p>Jan</p>
      `,
    });

    return new Response("Mail erfolgreich versendet ✅");
  } catch (e) {
    console.error(e);
    return new Response("Fehler beim automatischen Versand ❌", { status: 500 });
  }
}
