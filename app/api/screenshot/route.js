import { put } from "@vercel/blob";

export const runtime = "edge"; // optional, macht’s schneller

export async function GET() {
  const microlinkUrl =
    "https://api.microlink.io/?url=https://www.wsj.com/market-data/currencies/exchangerates&screenshot=true&meta=false&fullPage=true";

  const res = await fetch(microlinkUrl);
  const data = await res.json();

  if (data.status !== "success") {
    return new Response(JSON.stringify({ error: "Screenshot fehlgeschlagen" }), {
      status: 500,
    });
  }

  const imageUrl = data.data.screenshot.url;
  const imageRes = await fetch(imageUrl);
  const blobBuffer = await imageRes.arrayBuffer();

  // Datei speichern
  const fileName = `screenshot-${Date.now()}.png`;
  const { url } = await put(fileName, blobBuffer, {
    access: "public",
    contentType: "image/png",
  });

  return new Response(JSON.stringify({ imageUrl: url }), {
    headers: { "Content-Type": "application/json" },
  });
}
