export function getValidArray<T = any>(array?: T[]): T[] {
  if (array === undefined) {
    return []
  }

  return Array.isArray(array) ? array : []
}

export function isEmptyArray<T = any>(array?: T[]): boolean {
  return getValidArray<T>(array).length === 0
}
