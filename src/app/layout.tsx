import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'
import { mikado_reg, mikado_bold } from '@/fonts/fonts'
import { QueryProvider } from '@/providers/query-provider'
import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { SessionProvider } from 'next-auth/react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Monalouisa Teaches',
  description: 'Monalouisa Teaches',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html
      lang='en'
      className={`${mikado_reg.variable} ${mikado_bold.variable}`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <SessionProvider session={session}>
          <QueryProvider>{children}</QueryProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
