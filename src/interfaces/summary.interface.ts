import { IBaseEntity } from './base.interface'

export interface ISummary extends IBaseEntity {
  synced_at: Date
  succeed: boolean
}
