import { IDBPDatabase, openDB, StoreNames } from 'idb'
import { v4 as uuidv4 } from 'uuid'

// *INFO: internal modules
import { IndexDBActions, TAddPayload, TUpdatePayload } from '@/interfaces'
import { IIndexDBSchema } from './schema'

type Name = StoreNames<IIndexDBSchema>

class IndexDB {
  private _db: IDBPDatabase<IIndexDBSchema> | null
  private readonly _name: string
  private readonly _version: number

  constructor() {
    this._name = process.env['NEXT_PUBLIC_INDEXDB_NAME'] ?? ''
    this._version = 1
    this._db = null
  }

  public async initialize(): Promise<void> {
    const db = await openDB<IIndexDBSchema>(this._name, this._version, {
      upgrade(db) {
        // *INFO: create payments store
        db.createObjectStore('payments', {
          keyPath: 'id',
        })
      },
    })

    this._db = db
  }

  public getActions<T = any>(storeName: Name): IndexDBActions<T> {
    return {
      getAll: () => this._getAll<T>(storeName),
      getWithFilter: (
        filter: (value: T) => boolean,
        sort?: (a: T, b: T) => number,
      ) => this._getWithFilter<T>(storeName, filter, sort),
      getDetails: (key: string) => this._getDetails<T>(storeName, key),
      add: (payload: TAddPayload<T>) => this._add<T>(storeName, payload),
      update: (key: string, value: TUpdatePayload<T>) =>
        this._update<T>(storeName, key, value),
      delete: (key: string) => this._delete(storeName, key),
      clearStore: () => this._clearStore(storeName),
    }
  }

  private async _getAll<T>(storeName: Name): Promise<T[]> {
    return (await this._db?.getAll(storeName)) as T[]
  }

  private async _getWithFilter<T>(
    storeName: Name,
    filter: (value: T) => boolean,
    sort?: (a: T, b: T) => number,
  ): Promise<T[]> {
    const all = await this._getAll<T>(storeName)
    const filtered = (all ?? []).filter(filter)

    if (!sort) return filtered

    return (filtered ?? []).sort(sort)
  }

  private async _getDetails<T>(storeName: Name, key: string): Promise<T> {
    return (await this._db?.get(storeName, key)) as T
  }

  private async _add<T>(
    storeName: Name,
    value: TAddPayload<T>,
  ): Promise<T | undefined> {
    const newId = uuidv4()
    const now = new Date()

    const newEnitty = {
      id: newId,
      created_at: now,
      updated_at: now,
      removed: false,
      ...value,
    }

    // *INFO: response new id
    const id = await this._db?.add(storeName, newEnitty as any)

    if (!id) {
      return undefined
    }

    return newEnitty as T
  }

  private async _update<T>(
    storeName: Name,
    key: string,
    value: TUpdatePayload<T>,
  ): Promise<void> {
    const details = await this._getDetails(storeName, key)

    if (!details) throw new Error('Entity not found')

    await this._db?.put(storeName, {
      ...details,
      ...value,
      updated_at: new Date(),
      id: key,
    } as any)
  }

  private async _delete(storeName: Name, key: string): Promise<void> {
    await this._db?.delete(storeName, key)
  }

  private async _clearStore(storeName: Name): Promise<void> {
    await this._db?.clear(storeName)
  }
}

const indexDB = new IndexDB()

export default indexDB
