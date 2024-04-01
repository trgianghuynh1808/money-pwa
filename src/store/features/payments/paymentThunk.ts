import { createAsyncThunk } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { Timestamp, and, where } from 'firebase/firestore'

// *INFO: internal modules
import { firebaseDB, indexDB } from '@/db'
import { IPayment, TAddPayload, TUpdatePayload } from '@/interfaces'
import {
  convertUnixToDate,
  getValidArray,
  handleSyncIntoOfflineDB,
  handleSyncIntoOnlineDB,
} from '@/utils'
import { handleArchivePayments } from '@/utils/archivePayments'

const indexDBActions = indexDB.getActions<IPayment>('payments')
const firebaseDBActions = firebaseDB.getActions<IPayment>('payments')

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
      return (
        dayjs(item.payment_at).month() === dayjs().month() &&
        !item.removed &&
        !item.archived
      )
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

export const getPaymentsInLastMonth = createAsyncThunk(
  'payments/getPaymentsInLastMonth',
  async (): Promise<IPayment[]> => {
    const payments = await indexDBActions.getWithFilter((item) => {
      const nowMonth = dayjs().month()

      return dayjs(item.payment_at).month() !== nowMonth
    })

    return payments ?? []
  },
)

export const archivePayments = createAsyncThunk(
  'payments/archivePayments',
  async (): Promise<void> => {
    await handleArchivePayments()
  },
)

export const getPaymentsFiltered = createAsyncThunk(
  'payments/getPaymentsFiltered',
  async ({ monthFilter }: { monthFilter: number }): Promise<IPayment[]> => {
    const startMonthDate = dayjs().month(monthFilter).startOf('month').toDate()
    const endMonthDate = dayjs().month(monthFilter).endOf('month').toDate()

    const payments = await firebaseDBActions.getWithFilter(
      and(
        where('created_at', '>=', startMonthDate),
        where('created_at', '<=', endMonthDate),
      ),
    )

    const filtertedPayments = payments.filter((item) => item.removed !== true)

    return getValidArray(filtertedPayments).map((item) => {
      return {
        ...item,
        payment_at: convertUnixToDate(item.payment_at as any) as Date,
      }
    })
  },
)
