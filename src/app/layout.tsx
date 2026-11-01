import Script from 'next/script'
import type { Metadata } from 'next'
import { profile } from '@/data/profile'
import { shareImage } from '@/lib/shareMetadata'
import './fonts.css'
import './theme.css'
import './globals.css'
import { IdentifyOwner } from '@/components/IdentifyOwner/IdentifyOwner'

export const metadata: Metadata = {
  metadataBase: new URL('https://chrishoneysett.dev'),
  title: `${profile.name} — ${profile.headline}`,
  description:
    'Chris Honeysett is a senior frontend engineer building reusable React foundations, web interfaces, and connected React Native apps.',
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — ${profile.headline}`,
    description:
      'Chris Honeysett is a senior frontend engineer building reusable React foundations, web interfaces, and connected React Native apps.',
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.title}`,
    description:
      'Chris Honeysett is a senior frontend engineer building reusable React foundations, web interfaces, and connected React Native apps.',
    images: [shareImage],
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        {children}
        <Script id='restore-theme' strategy='beforeInteractive'>
          {`try {
            const theme = localStorage.getItem("theme");
            if (theme === "light" || theme === "dark") {
              document.documentElement.dataset.theme = theme;
            }
          } catch { /* Storage can be unavailable; CSS follows the system theme. */ }`}
        </Script>
        <IdentifyOwner />
        <script
          defer
          src='https://cloud.umami.is/script.js'
          data-website-id='d2ff7b30-0924-4760-97cb-3f4469b96ac9'
        ></script>
      </body>
    </html>
  )
}
