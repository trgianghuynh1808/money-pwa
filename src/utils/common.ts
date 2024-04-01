import { Timestamp } from 'firebase/firestore'

export function getValidArray<T = any>(array?: T[]): T[] {
  if (array === undefined) {
    return []
  }

  return Array.isArray(array) ? array : []
}

export function isEmptyArray<T = any>(array?: T[]): boolean {
  return getValidArray<T>(array).length === 0
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function convertUnixToDate(time: Timestamp): Date | undefined {
  return time ? time.toDate() : undefined
}
