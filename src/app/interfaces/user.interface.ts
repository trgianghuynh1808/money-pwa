import { IBaseEntity } from './base.interface'

export interface IUser extends IBaseEntity {
  username: string
  code: string
}
