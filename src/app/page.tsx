'use client'

import { useEffect, useState } from 'react'
import { DateValueType } from 'react-tailwindcss-datepicker'

// *INFO: internal modules
import { PaymentForm, PaymentList } from '@/components/pages/home'
import {
  CATEGORY_OPTIONS,
  EPaymentFormMode,
} from '@/components/pages/home/constants'
import { PaymentFormContext } from '@/components/pages/home/paymentForm.context'
import { useAppDispatch } from '@/store'
import {
  getPaymentsInLastMonth,
  getPaymentsInMonth,
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
  const [selectedKey, setSelectedKey] = useState<string>('')

  function fetchData(): void {
    dispatch(getPaymentsInMonth())
    dispatch(getPaymentsInLastMonth())
  }

  useEffect(() => {
    fetchData()
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
        selectedKey,
        setSelectedKey,
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
