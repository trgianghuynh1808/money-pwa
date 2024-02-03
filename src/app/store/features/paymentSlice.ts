import { createSlice } from '@reduxjs/toolkit'
import type { SerializedError } from '@reduxjs/toolkit'

// *INFO: internal modules
import { IPayment } from '@/app/interfaces'
import { addPayment, getAllPayments } from './paymentThunk'

interface IPaymentState {
  paymentsInMonth: IPayment[]
  loading: boolean
  error: SerializedError | null
}

const initialState: IPaymentState = {
  paymentsInMonth: [] as IPayment[],
  loading: false,
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
      })
  },
})

export const paymentReducer = paymentSlice.reducer
