export async function GET() {
  const microlinkUrl =
    "https://api.microlink.io/?url=https://www.wsj.com/market-data/currencies/exchangerates&screenshot=true&meta=false&fullPage=true";

  const res = await fetch(microlinkUrl);
  const data = await res.json();

  if (data.status !== "success") {
    return new Response(JSON.stringify({ error: "Screenshot failed" }), { status: 500 });
  }

  const imageUrl = data.data.screenshot.url;

  // Schicke einfach den Screenshot-Link zurück (kein echtes File-Speichern auf Disk)
  return new Response(JSON.stringify({ imageUrl }), {
    headers: { "Content-Type": "application/json" },
  });
}
