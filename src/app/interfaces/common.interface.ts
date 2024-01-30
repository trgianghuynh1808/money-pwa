export type TAddPayload<T = any> = Omit<T, 'id' | 'created_at' | 'removed'>

export type Actions<T = any> = {
  getAll: () => Promise<T[]>
  getWithFilter: (
    filter: (value: T) => boolean,
    sort?: (a: T, b: T) => number,
  ) => Promise<T[]>
  getDetails: (key: string) => Promise<T>
  add: (payload: TAddPayload<T>) => Promise<string | undefined>
  update: (key: string, value: Partial<Omit<T, 'id'>>) => Promise<void>
  delete: (key: string) => Promise<void>
  clearStore: () => Promise<void>
}
