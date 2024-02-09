import { IBaseEntity } from './base.interface'
import { EInputMode, EPaymentCategory } from '@/app/enums'

export interface IPayment extends IBaseEntity {
  price: number
  mode: EInputMode
  category: EPaymentCategory
  synced: boolean
  synced_at?: Date
  archived?: boolean
  archived_at?: Date
  ref_index_id?: string
  ref_firebase_id?: string
}
