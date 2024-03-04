import type { SerializedError } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

// *INFO: internal modules
import { IPayment } from '@//interfaces'
import { getValidArray } from '@/utils'
import {
  addPayment,
  editPayment,
  getPaymentsInMonth,
  removePayment,
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
      .addCase(editPayment.pending, (state) => {
        state.loading = true
      })
      .addCase(editPayment.fulfilled, (state, action) => {
        const { key, payload } = action.payload

        state.loading = false

        const currentPaymentIndex = getValidArray(
          state.paymentsInMonth,
        ).findIndex((item) => item.id === key)

        state.paymentsInMonth[currentPaymentIndex] = {
          ...state.paymentsInMonth[currentPaymentIndex],
          ...payload,
        }
      })
      .addCase(editPayment.rejected, (state) => {
        state.loading = false
      })
      .addCase(removePayment.pending, (state) => {
        state.loading = true
      })
      .addCase(removePayment.fulfilled, (state, action) => {
        const { key } = action.payload

        state.loading = false

        state.paymentsInMonth = state.paymentsInMonth.filter((item) => {
          return item.id !== key
        })
      })
      .addCase(removePayment.rejected, (state) => {
        state.loading = false
      })
      .addCase(getPaymentsInMonth.fulfilled, (state, action) => {
        state.paymentsInMonth = action.payload
        state.fetching = false
      })
      .addCase(getPaymentsInMonth.pending, (state) => {
        state.fetching = true
      })
      .addCase(getPaymentsInMonth.rejected, (state) => {
        state.fetching = false
      })
      .addCase(syncPaymentsIntoOfflineDB.fulfilled, (state, action) => {
        state.paymentsInMonth = action.payload
      })
  },
})

export const paymentReducer = paymentSlice.reducer
