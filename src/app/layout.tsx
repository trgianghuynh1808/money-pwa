'use client'

import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

// *INFO: internal modules
import './globals.css'
import { indexDB } from '@/app/db'
import { store } from '@/app/store'
import { useInternetStatus } from '@/app/hooks'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const { isOnline } = useInternetStatus()

  async function initDB(): Promise<void> {
    await indexDB.initialize()
  }

  useEffect(() => {
    if (!mounted) {
      initDB()
      setMounted(true)
    }
  }, [mounted])

  useEffect(() => {}, [isOnline])

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ReduxProvider store={store}>{children}</ReduxProvider>
      </body>
    </html>
  )
}
