import { DBSchema } from 'idb'

// *INFO: internal modules
import { IPayment } from '../../interfaces'

export interface IIndexDBSchema extends DBSchema {
  payments: {
    key: string
    value: IPayment
  }
}
