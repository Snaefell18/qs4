export const metadata = {
  title: "Microlink Screenshot App",
  description: "Eine kleine Demo-App mit Next.js + Vercel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "sans-serif",
          backgroundColor: "#f9fafb",
          color: "#111",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
