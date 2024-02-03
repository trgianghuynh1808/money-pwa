import { createAsyncThunk } from '@reduxjs/toolkit'

// *INFO: internal modules
import { indexDB } from '@/app/db'
import { IPayment, TAddPayload } from '@/app/interfaces'

export const addPayment = createAsyncThunk(
  'payments/addPayment',
  async (payload: TAddPayload<IPayment>): Promise<IPayment | undefined> => {
    const indexDBActions = indexDB.getActions<IPayment>('payments')

    const newPayment = await indexDBActions.add(payload)

    if (!newPayment) {
      throw new Error('Thêm payment thất bại')
    }

    return newPayment
  },
)
