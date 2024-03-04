import { DBSchema } from 'idb'

// *INFO: internal modules
import { IPayment, ISummary } from '@/interfaces'

export interface IIndexDBSchema extends DBSchema {
  payments: {
    key: string
    value: IPayment
  }
  summaries: {
    key: string
    value: ISummary
  }
}
