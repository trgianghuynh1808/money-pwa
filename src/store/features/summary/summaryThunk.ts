import { createAsyncThunk } from '@reduxjs/toolkit'

// *INFO: internal modules
import { indexDB } from '@/db'
import { ISummary, TAddPayload, TUpdatePayload } from '@/interfaces'

const indexDBActions = indexDB.getActions<ISummary>('summaries')

export const getSummary = createAsyncThunk(
  'summaries/getSummary',
  async (): Promise<ISummary | null> => {
    const data = await indexDBActions.getAll()

    return data?.length ? data[data.length - 1] : null
  },
)

export const addSummary = createAsyncThunk(
  'summaries/addSummary',
  async (payload: TAddPayload<ISummary>): Promise<ISummary | undefined> => {
    const newSummary = await indexDBActions.add(payload)

    if (!newSummary) {
      throw new Error('Thêm summary thất bại')
    }

    return newSummary
  },
)

export const editSummary = createAsyncThunk(
  'summaries/editSummary',
  async ({
    key,
    payload,
  }: {
    key: string
    payload: TUpdatePayload<ISummary>
  }) => {
    await indexDBActions.update(key, payload)

    return {
      key,
      payload,
    }
  },
)
