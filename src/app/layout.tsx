import type { Metadata } from "next";
import Script from "next/script";
import { resume } from "@/domains/development/data/resume";
import "./theme.css";
import "./globals.css";

export const metadata: Metadata = {
  title: `${resume.name} — ${resume.headline}`,
  description: "Senior frontend engineer building React applications and connected mobile experiences with React Native, BLE, and NFC.",
  authors: [{ name: resume.name }],
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
