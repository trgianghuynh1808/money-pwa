import { useEffect, useState } from 'react'

export function useInternetStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(window?.navigator?.onLine)

  useEffect(() => {
    window.addEventListener('offline', () => {
      setIsOnline(false)
    })
    window.addEventListener('online', () => {
      setIsOnline(true)
    })

    // *INFO: clean up to avoid memory-leak
    return () => {
      window.removeEventListener('online', () => {})
      window.removeEventListener('offline', () => {})
    }
  }, [])

  return { isOnline }
}
