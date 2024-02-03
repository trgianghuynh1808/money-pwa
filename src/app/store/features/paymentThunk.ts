import { createAsyncThunk } from '@reduxjs/toolkit'

// *INFO: internal modules
import { indexDB } from '@/app/db'
import { IPayment, TAddPayload } from '@/app/interfaces'

const indexDBActions = indexDB.getActions<IPayment>('payments')

export const addPayment = createAsyncThunk(
  'payments/addPayment',
  async (payload: TAddPayload<IPayment>): Promise<IPayment | undefined> => {
    const newPayment = await indexDBActions.add(payload)

    if (!newPayment) {
      throw new Error('Thêm payment thất bại')
    }

    return newPayment
  },
)

export const getAllPayments = createAsyncThunk(
  'payments/getAllPayments',
  async (): Promise<IPayment[]> => {
    const payments = await indexDBActions.getAll()

    return payments ?? []
  },
)
