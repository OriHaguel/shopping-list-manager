import '../styles/globals.css'
import '../styles/globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactQueryClientProvider } from './react-query-provider'
import { Providers } from './providers'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Listeck: The Quickest Shopping List Manager',
  description:
    'Listeck is the ultimate free shopping list manager. Organize groceries, add items via voice, and sync lists with family in real-time.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ReactQueryClientProvider>
          <Providers>
            {children}
          </Providers>
        </ReactQueryClientProvider>

        {/* ✅ Google Analytics */}
        <GoogleAnalytics gaId="G-LLC3HT5V9C" />
      </body>
    </html>
  )
}