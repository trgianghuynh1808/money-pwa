'use client'

import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { DateValueType } from 'react-tailwindcss-datepicker'

// *INFO: internal modules
import { PaymentForm, PaymentList } from '@/components/pages/home'
import {
  CATEGORY_OPTIONS,
  EPaymentFormMode,
} from '@/components/pages/home/constants'
import { PaymentFormContext } from '@/components/pages/home/paymentForm.context'
import { SYNCED_AT_STORAGE_KEY } from '@/constants'
import { useAppDispatch } from '@/store'
import {
  getAllPayments,
  syncPaymentsIntoOfflineDB,
  syncPaymentsIntoOnlineDB,
} from '@/store/features/payments/paymentThunk'

export default function Home() {
  const dispatch = useAppDispatch()
  const [paymentCategoryOption, setPaymentCategoryOption] = useState(
    CATEGORY_OPTIONS[0],
  )
  const [price, setPrice] = useState<string>('')
  const [pickDate, setPickDate] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  })
  const [formMode, setFormMode] = useState<EPaymentFormMode>(
    EPaymentFormMode.ADD,
  )
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false)

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

  useEffect(() => {
    dispatch(getAllPayments())
  }, [])

  return (
    <PaymentFormContext.Provider
      value={{
        paymentCategoryOption,
        setPaymentCategoryOption,
        price,
        setPrice,
        pickDate,
        setPickDate,
        formMode,
        setFormMode,
        showPaymentModal,
        setShowPaymentModal,
      }}
    >
      <div className="flex-1 p-3">
        <PaymentForm />
        <div className="mt-4">
          <PaymentList />
        </div>
      </div>
    </PaymentFormContext.Provider>
  )
}
