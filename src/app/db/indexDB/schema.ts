import { DBSchema } from 'idb'
// *INFO: internal modules
import { IUser } from '../../interfaces'

export interface IIndexDBSchema extends DBSchema {
  users: {
    key: string
    value: IUser
  }
}
