import { put } from "@vercel/blob";

export const runtime = "edge";

export async function GET() {
  try {
    const microlinkUrl =
      "https://api.microlink.io/?url=https://www.wsj.com/market-data/currencies/exchangerates&screenshot=true&meta=false&fullPage=true";

    const res = await fetch(microlinkUrl);
    const data = await res.json();

    const imageUrl = data?.data?.screenshot?.url;
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Kein Screenshot gefunden" }), { status: 500 });
    }

    const imageRes = await fetch(imageUrl);
    const buffer = await imageRes.arrayBuffer();

    const fileName = `screenshot-${Date.now()}.png`;
    const { url } = await put(fileName, buffer, {
      access: "public",
      contentType: "image/png",
    });

    return new Response(JSON.stringify({ imageUrl: url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Fehler" }), { status: 500 });
  }
}
