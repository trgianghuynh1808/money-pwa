'use client'

import Link from 'next/link'
import { useInternetStatus } from './hooks'
import { useAppDispatch, useAppSelector } from './store'
import { addPayment } from './store/features/paymentThunk'
import { EInputMode, EPaymentCategory } from './enums'

export default function Home() {
  const { isOnline } = useInternetStatus()
  const dispatch = useAppDispatch()
  const { paymentsInMonth, loading, error } = useAppSelector(
    (state) => state.payments,
  )

  async function onClickAction() {
    console.log('run action')
    const newPayment = await dispatch(
      addPayment({
        price: 10,
        mode: EInputMode.BOY,
        category: EPaymentCategory.PET,
        synced: false,
      }),
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Link href={'/home'}>Home Page</Link>
        <div>
          <button onClick={onClickAction}>action</button>
        </div>
      </div>
    </main>
  )
}
