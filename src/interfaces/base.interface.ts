export interface IBaseEntity {
  id: string
  created_at: Date
  updated_at?: Date
  removed_at?: Date
  removed: boolean
}
