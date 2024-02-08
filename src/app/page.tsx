'use client'

import Link from 'next/link'
import { useEffect } from 'react'

// *INFO: internal modules
import { EInputMode, EPaymentCategory } from './enums'
import { useInternetStatus } from './hooks'
import { useAppDispatch, useAppSelector } from './store'
import {
  addPayment,
  getAllPayments,
  syncPaymentsIntoOfflineDB,
  syncPaymentsIntoOnlineDB,
} from './store/features/paymentThunk'

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

    console.log(newPayment)
  }

  async function handleSyncPayments(): Promise<void> {
    await dispatch(syncPaymentsIntoOnlineDB())
    await dispatch(syncPaymentsIntoOfflineDB())
  }

  useEffect(() => {
    dispatch(getAllPayments())
  }, [])

  useEffect(() => {
    if (isOnline) {
      handleSyncPayments()
    }
  }, [isOnline])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Link href={'/home'}>Home Page</Link>
        <div>{JSON.stringify(paymentsInMonth)}</div>
        <div>
          <button onClick={onClickAction}>action</button>
        </div>
      </div>
    </main>
  )
}
