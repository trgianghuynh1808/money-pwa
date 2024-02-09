'use client'

import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

// *INFO: internal modules
import './globals.css'
import { indexDB } from '@/app/db'
import { store } from '@/app/store'
import { Header, BottomTabNavigator } from './components/layout'
import { EInputMode } from './enums'
import { AppContext } from './contexts'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState<boolean>(false)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [inputMode, setInputMode] = useState<EInputMode>(EInputMode.GIRL)

  async function initDB(): Promise<void> {
    await indexDB.initialize()
  }

  async function initializeApp(): Promise<void> {
    await initDB()
    setIsReady(true)
  }

  useEffect(() => {
    if (!mounted) {
      initializeApp()
      setMounted(true)
    }
  }, [mounted])

  function LoadingSpiner() {
    // *TODO: implement loadingSpiner later
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body
        className={`${inter.className} w-full min-h-screen bg-gray-300 flex justify-center`}
        suppressHydrationWarning={true}
      >
        <ReduxProvider store={store}>
          <AppContext.Provider
            value={{
              inputMode,
              setInputMode,
            }}
          >
            <main className="w-full md:w-4/5 lg:w-2/5 bg-white rounded shadow-lg flex flex-col justify-between">
              <Header />
              {!isReady ? <LoadingSpiner /> : <>{children}</>}
              <BottomTabNavigator />
            </main>
          </AppContext.Provider>
        </ReduxProvider>
      </body>
    </html>
  )
}
