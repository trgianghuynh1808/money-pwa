export interface IBaseEntity {
  id: string
  created_at: Date
  creator?: string
  removed_at?: Date
  removed: boolean
}
