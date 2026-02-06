import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NovaLearn — The Most Accurate AI Detector on the Market',
  description: 'Detect AI-generated content with 99.9% accuracy. ChatGPT, Claude, Gemini and more. Third-party verified, near-zero false positive rate.',
  keywords: ['AI detection', 'ChatGPT detector', 'AI plagiarism detection', 'academic integrity', 'NovaLearn'],
  openGraph: {
    title: 'NovaLearn — The Most Accurate AI Detector on the Market',
    description: 'Detect AI content with 99.9% accuracy. Third-party verified results.',
    type: 'website',
    locale: 'en_GB',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
