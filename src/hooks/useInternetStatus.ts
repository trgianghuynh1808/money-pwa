import { useEffect, useState } from 'react'

export function useInternetStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== 'undefined' ? window.navigator.onLine : false,
  )

  useEffect(() => {
    const handleChangeStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('offline', () => {
      setIsOnline(false)
    })
    window.addEventListener('online', () => {
      setIsOnline(true)
    })

    // *INFO: clean up to avoid memory-leak
    return () => {
      window.removeEventListener('online', handleChangeStatus)
      window.removeEventListener('offline', handleChangeStatus)
    }
  }, [])

  return { isOnline }
}
