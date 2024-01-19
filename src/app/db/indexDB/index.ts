import { IDBPDatabase, openDB, StoreNames } from 'idb'
import { v4 as uuidv4 } from 'uuid'
// *INFO: internal modules
import { IIndexDBSchema } from './schema'

type Name = StoreNames<IIndexDBSchema>

type Actions<T = any> = {
  getAll: () => Promise<T[]>
  getDetails: (key: string) => Promise<T>
  add: (payload: Omit<T, 'id'>) => Promise<string | undefined>
  update: (key: string, value: Partial<Omit<T, 'id'>>) => Promise<void>
  delete: (key: string) => Promise<void>
  clearStore: () => Promise<void>
}

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
    this._db = await openDB<IIndexDBSchema>(this._name, this._version, {
      upgrade(db) {
        // *INFO: create users store
        db.createObjectStore('users', {
          keyPath: 'id',
        })
      },
    })
  }

  public getActions<T = any>(storeName: Name): Actions<T> {
    return {
      getAll: () => this._getAll<T>(storeName),
      getDetails: (key: string) => this._getDetails<T>(storeName, key),
      add: (payload: Omit<T, 'id'>) => this._add<T>(storeName, payload),
      update: (key: string, value: Partial<Omit<T, "id">>) =>
        this._update<T>(storeName, key, value),
      delete: (key: string) => this._delete(storeName, key),
      clearStore: () => this._clearStore(storeName),
    }
  }

  private async _getAll<T = any>(storeName: Name): Promise<T[]> {
    return (await this._db?.getAll(storeName)) as T[]
  }

  private async _getDetails<T = any>(storeName: Name, key: string): Promise<T> {
    return (await this._db?.get(storeName, key)) as T
  }

  private async _add<T = any>(
    storeName: Name,
    value: Omit<T, 'id'>,
  ): Promise<string | undefined> {
    const newId = uuidv4()

    // *INFO: response new id
    return await this._db?.add(storeName, {
      ...value,
      id: newId,
    } as any)
  }

  private async _update<T = any>(
    storeName: Name,
    key: string,
    value: Partial<Omit<T, 'id'>>,
  ): Promise<void> {
    const details = await this._getDetails(storeName, key)

    if (!details) throw new Error('Entity not found')

    await this._db?.put(storeName, {
      ...details,
      ...value,
      id: key,
    })
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
