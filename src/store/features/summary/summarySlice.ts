import type { SerializedError } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

// *INFO: internal modules
import { ISummary } from '@//interfaces'
import { addSummary, editSummary, getSummary } from './summaryThunk'

interface ISummrayState {
  currentSummary: ISummary | null
  loading: boolean
  fetching: boolean
  error: SerializedError | null
}

const initialState: ISummrayState = {
  currentSummary: null,
  loading: false,
  fetching: false,
  error: null,
}

const summarySlice = createSlice({
  initialState,
  name: 'summaries',
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSummary.pending, (state) => {
        console.log('run here')
        state.loading = true
      })
      .addCase(addSummary.fulfilled, (state, action) => {
        const payload = action.payload as ISummary
        state.loading = false
        console.log({ payload })
        state.currentSummary = payload
      })
      .addCase(addSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(editSummary.pending, (state) => {
        state.loading = true
      })
      .addCase(editSummary.fulfilled, (state, action) => {
        const { payload } = action.payload

        state.loading = false
        if (state.currentSummary) {
          Object.assign(state.currentSummary, {
            synced_at: payload.synced_at,
            succeed: payload.succeed,
          })
        }
      })
      .addCase(editSummary.rejected, (state) => {
        state.loading = false
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.currentSummary = action.payload
        state.fetching = false
      })
      .addCase(getSummary.pending, (state) => {
        state.fetching = true
      })
      .addCase(getSummary.rejected, (state) => {
        state.fetching = false
      })
  },
})

export const summaryReducer = summarySlice.reducer
