import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "code helper",
  description: "Cole seu erro. Entenda o que aconteceu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}