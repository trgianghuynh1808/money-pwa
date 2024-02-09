import { createSlice } from '@reduxjs/toolkit'
import type { SerializedError } from '@reduxjs/toolkit'

// *INFO: internal modules
import { IPayment } from '@/interfaces'
import {
  addPayment,
  getAllPayments,
  syncPaymentsIntoOfflineDB,
} from './paymentThunk'

interface IPaymentState {
  paymentsInMonth: IPayment[]
  loading: boolean
  fetching: boolean
  error: SerializedError | null
}

const initialState: IPaymentState = {
  paymentsInMonth: [] as IPayment[],
  loading: false,
  fetching: false,
  error: null,
}

const paymentSlice = createSlice({
  initialState,
  name: 'payments',
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPayment.pending, (state) => {
        state.loading = true
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false
        state.paymentsInMonth.push(action.payload as IPayment)
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.paymentsInMonth = action.payload
        state.fetching = false
      })
      .addCase(getAllPayments.pending, (state) => {
        state.fetching = true
      })
      .addCase(getAllPayments.rejected, (state) => {
        state.fetching = false
      })
      .addCase(syncPaymentsIntoOfflineDB.fulfilled, (state, action) => {
        state.paymentsInMonth = [...state.paymentsInMonth, ...action.payload]
      })
  },
})

export const paymentReducer = paymentSlice.reducer
