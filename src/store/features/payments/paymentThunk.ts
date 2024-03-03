import { createAsyncThunk } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

// *INFO: internal modules
import { indexDB } from '@/db'
import { IPayment, TAddPayload, TUpdatePayload } from '@/interfaces'
import { handleSyncIntoOfflineDB, handleSyncIntoOnlineDB } from '@/utils'

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

export const editPayment = createAsyncThunk(
  'payments/editPayment',
  async ({
    key,
    payload,
  }: {
    key: string
    payload: TUpdatePayload<IPayment>
  }) => {
    await indexDBActions.update(key, payload)

    return {
      key,
      payload,
    }
  },
)

export const removePayment = createAsyncThunk(
  'payments/removePayment',
  async ({ key }: { key: string }) => {
    await indexDBActions.update(key, {
      removed: true,
      removed_at: new Date(),
      synced: false,
    })

    return {
      key,
    }
  },
)

export const getPaymentsInMonth = createAsyncThunk(
  'payments/getPaymentsInMonth',
  async (): Promise<IPayment[]> => {
    const payments = await indexDBActions.getWithFilter((item) => {
      return dayjs(item.payment_at).month() === dayjs().month() && !item.removed
    })

    return payments ?? []
  },
)

export const syncPaymentsIntoOnlineDB = createAsyncThunk(
  'payments/syncPaymentIntoOnlineDB',
  async (): Promise<void> => {
    await handleSyncIntoOnlineDB()
  },
)

export const syncPaymentsIntoOfflineDB = createAsyncThunk(
  'payments/syncPaymentsIntoOfflineDB',
  async (): Promise<IPayment[]> => {
    return (await handleSyncIntoOfflineDB()) as any
  },
)
