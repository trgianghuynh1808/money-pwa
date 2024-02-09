'use client'

import dayjs from 'dayjs'
import Link from 'next/link'
import { useEffect } from 'react'

// *INFO: internal modules
import { SYNCED_AT_STORAGE_KEY } from '@/constants'
import { EInputMode, EPaymentCategory } from '@/enums'
import { useInternetStatus } from '@/hooks'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  addPayment,
  getAllPayments,
  syncPaymentsIntoOfflineDB,
  syncPaymentsIntoOnlineDB,
} from '@/store/features/payments/paymentThunk'

export default function Home() {
  const { isOnline } = useInternetStatus()
  const dispatch = useAppDispatch()
  const { paymentsInMonth, loading, error, fetching } = useAppSelector(
    (state) => state.payments,
  )

  async function onClickAction() {
    const newPayment = await dispatch(
      addPayment({
        price: 10,
        mode: EInputMode.BOY,
        category: EPaymentCategory.PET,
        synced: false,
      }),
    )
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

  useEffect(() => {
    dispatch(getAllPayments())
  }, [])

  useEffect(() => {
    const isSyncExpired = checkExpiredSyncDuration()

    if (isOnline && isSyncExpired) {
      handleSyncPayments()
    }
  }, [isOnline])

  return (
    <div className="flex flex-col items-center justify-between">
      <div>
        <Link href={'/home'}>Home Page</Link>
      </div>
    </div>
  )
}
