import Script from 'next/script'
import type { Metadata } from 'next'
import { profile } from '@/data/profile'
import './fonts.css'
import './theme.css'
import './globals.css'
import { IdentifyOwner } from '@/components/IdentifyOwner/IdentifyOwner'

export const metadata: Metadata = {
  metadataBase: new URL('https://chrishoneysett.dev'),
  title: `${profile.name} — ${profile.headline}`,
  description:
    'Clear vision. Crafted code. Chris Honeysett is a senior frontend engineer bringing design and engineering together for React and React Native products.',
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — ${profile.headline}`,
    description:
      'Clear vision. Crafted code. Chris Honeysett is a senior frontend engineer bringing design and engineering together for React and React Native products.',
    images: [
      {
        url: '/shareImage.png',
        width: 1200,
        height: 630,
        alt: 'Chris Honeysett — Clear vision. Crafted code.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.headline}`,
    description:
      'Clear vision. Crafted code. Chris Honeysett is a senior frontend engineer bringing design and engineering together for React and React Native products.',
    images: ['/shareImage.png'],
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
