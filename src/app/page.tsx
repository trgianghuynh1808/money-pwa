'use client'

import dayjs from 'dayjs'
import { useEffect } from 'react'

// *INFO: internal modules
import { SYNCED_AT_STORAGE_KEY } from '@/constants'
import { EInputMode, EPaymentCategory } from '@/enums'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  addPayment,
  getAllPayments,
  syncPaymentsIntoOfflineDB,
  syncPaymentsIntoOnlineDB,
} from '@/store/features/payments/paymentThunk'
import { sleep } from '@/utils'

export default function Home() {
  const dispatch = useAppDispatch()
  const { paymentsInMonth, loading, error, fetching } = useAppSelector(
    (state) => state.payments,
  )

  function handleAfterAddPayment(): void {
    const isSyncExpired = checkExpiredSyncDuration()

    if (window.navigator.onLine && isSyncExpired) {
      handleSyncPayments()
    }
  }

  async function handleSyncPayments(): Promise<void> {
    await dispatch(syncPaymentsIntoOnlineDB())
    await dispatch(syncPaymentsIntoOfflineDB())
    //*INFO: save synced_at to storage
    localStorage.setItem(SYNCED_AT_STORAGE_KEY, dayjs().toString())
  }

  function checkExpiredSyncDuration(): boolean {
    const syncDurationEnabled =
      process.env.NEXT_PUBLIC_SYNC_DURATION_ENABLED === 'true'
    const durationHours = parseInt(
      process.env.NEXT_PUBLIC_SYNC_DURATION_HOURS || '0',
    )
    const syncedAtStorage = localStorage.getItem(SYNCED_AT_STORAGE_KEY)

    if (!syncDurationEnabled || !durationHours || !syncedAtStorage) {
      return true
    }

    const expireAt = dayjs(syncedAtStorage).add(durationHours, 'hour')

    return expireAt.isBefore(dayjs())
  }

  async function onClickAction() {
    const newPayment = await dispatch(
      addPayment({
        price: 10,
        mode: EInputMode.BOY,
        category: EPaymentCategory.PET,
        synced: false,
      }),
    )

    await sleep(1000)
    handleAfterAddPayment()
  }

  useEffect(() => {
    dispatch(getAllPayments())
  }, [])

  return (
    <div className="flex flex-col items-center justify-between">
      <div>
        <span>Home Page</span>
        <button onClick={onClickAction}>Add</button>
      </div>
    </div>
  )
}
