import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import localFont from "next/font/local";
import "./globals.css";

const wantedSans = localFont({
  src: [
    {
      path: "../fonts/WantedSans-Regular.otf",
      weight: "normal",
    },
    {
      path: "../fonts/WantedSans-SemiBold.otf",
      weight: "600",
    },
    {
      path: "../fonts/WantedSans-Black.otf",
      weight: "800",
    },
  ],
});

const dogica = localFont({
  src: "../fonts/dogica-pixel-bold.otf",
  variable: "--font-dogica",
});

export const metadata: Metadata = {
  title: "LEVEL.EZ",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${wantedSans.className} ${dogica.variable}`}>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
