import { QueryCompositeFilterConstraint } from 'firebase/firestore'

export type TAddPayload<T = any> = Omit<T, 'id' | 'created_at' | 'removed'>

export type TUpdatePayload<T = any> = Partial<Omit<T, 'id'>>

export type BaseActions<T = any> = {
  getAll: () => Promise<T[]>
  getDetails: (key: string) => Promise<T | undefined>
  add: (payload: TAddPayload<T>) => Promise<T | undefined>
  update: (key: string, value: TUpdatePayload<T>) => Promise<void>
  delete: (key: string) => Promise<void>
}

export type IndexDBActions<T = any> = BaseActions<T> & {
  getWithFilter: (
    filter: (value: T) => boolean,
    sort?: (a: T, b: T) => number,
  ) => Promise<T[]>
  clearStore: () => Promise<void>
}

export type FirebaseActions<T = any> = BaseActions<T> & {
  getWithFilter: (query?: QueryCompositeFilterConstraint) => Promise<T[]>
}

export interface IOption {
  label: string
  value: number
  iconSrc?: string
}
