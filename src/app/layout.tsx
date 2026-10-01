import Script from "next/script";
import type { Metadata } from "next";
import { profile } from "@/data/profile";
import "./theme.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://chrishoneysett.dev"),
  title: `${profile.name} — ${profile.headline}`,
  description: "Senior frontend engineer building React applications and connected mobile experiences with React Native, BLE, and NFC.",
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — ${profile.headline}`,
    description: "Senior frontend engineer building React applications and connected mobile experiences with React Native, BLE, and NFC.",
    images: [{ url: "/shareImage.png", alt: "Chris Honeysett — Making complex feel clear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.headline}`,
    description: "Senior frontend engineer building React applications and connected mobile experiences with React Native, BLE, and NFC.",
    images: ["/shareImage.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Script id="restore-theme" strategy="beforeInteractive">
          {`try {
            const theme = localStorage.getItem("theme");
            if (theme === "light" || theme === "dark") {
              document.documentElement.dataset.theme = theme;
            }
          } catch { /* Storage can be unavailable; CSS follows the system theme. */ }`}
        </Script>
      </body>
    </html>
  );
}
