'use client'

import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import './globals.css'
import { indexDB } from '@/app/db'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  async function initDB(): Promise<void> {
    await indexDB.initialize()
  }

  useEffect(() => {
    if (!mounted) {
      initDB()
      setMounted(true)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
