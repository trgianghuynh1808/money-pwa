import { createAsyncThunk } from '@reduxjs/toolkit'
import { where, and } from 'firebase/firestore'

// *INFO: internal modules
import { firebaseDB, indexDB } from '@/app/db'
import { IPayment, TAddPayload } from '@/app/interfaces'
import { getValidArray, isEmptyArray } from '@/app/utils'
import dayjs from 'dayjs'

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

export const getAllPayments = createAsyncThunk(
  'payments/getAllPayments',
  async (): Promise<IPayment[]> => {
    const payments = await indexDBActions.getAll()

    return payments ?? []
  },
)

export const syncPaymentsIntoOnlineDB = createAsyncThunk(
  'payments/syncPaymentIntoOnlineDB',
  async (): Promise<void> => {
    const notSyncedPayments = await indexDBActions.getWithFilter((item) => {
      return item.synced === false
    })

    if (isEmptyArray(notSyncedPayments)) return

    const addPromises = notSyncedPayments.map((item) => {
      const onlinePayment: TAddPayload<IPayment> = {
        ...item,
        synced: true,
        synced_at: new Date(),
        ref_index_id: item.id,
      }
      return firebaseDBActions.add(onlinePayment)
    })

    const newOnlinePayments = await Promise.all(addPromises)

    const updatePaymentSyncInfoPromises = getValidArray(newOnlinePayments).map(
      (item) => {
        return indexDBActions.update(item?.ref_index_id!, {
          synced: true,
          synced_at: new Date(),
          ref_firebase_id: item?.id,
        })
      },
    )

    await Promise.all(updatePaymentSyncInfoPromises)
  },
)

export const syncPaymentsIntoOfflineDB = createAsyncThunk(
  'payments/syncPaymentsIntoOfflineDB',
  async (): Promise<IPayment[]> => {
    const startInMonthDate = dayjs().startOf('month').toDate()
    const endInMonthDate = dayjs().endOf('month').toDate()

    const currentOfflinePayments = await indexDBActions.getAll()
    const currentOnlinePayments = await firebaseDBActions.getWithFilter(
      and(
        where('created_at', '>=', startInMonthDate),
        where('created_at', '<=', endInMonthDate),
      ),
    )
    const offlineRefFirebaseIds = getValidArray(currentOfflinePayments).map(
      (item) => item.ref_firebase_id,
    )

    const notSyncedOnlinePayments = getValidArray(currentOnlinePayments).filter(
      (item) => {
        if (!item.ref_index_id) {
          return false
        }

        return !offlineRefFirebaseIds.includes(item.id)
      },
    )

    const addPromises = notSyncedOnlinePayments.map((item) => {
      return indexDBActions.add({
        ...item,
        ref_firebase_id: item.id,
      }) as Promise<IPayment>
    })

    return await Promise.all(addPromises)
  },
)
