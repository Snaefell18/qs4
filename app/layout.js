export const metadata = {
  title: "Wechselkurse-Screenshot-App",
  description: "Microlink + Vercel Blob Demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        {children}
      </body>
    </html>
  );
}
