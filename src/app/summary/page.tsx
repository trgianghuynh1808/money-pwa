'use client'
import { useEffect, useState } from 'react'

// *INFO: internal modules
import { FilterSection, TotalSummarySection } from '@/components/pages/summary'
import {
  SummaryFilterContext,
  NOW_MONTH_OPTION,
} from '@/components/pages/summary/summaryFilter.context'
import { IOption } from '@/interfaces'
import { useAppDispatch } from '@/store'
import { getAllPayments } from '@/store/features/payments/paymentThunk'

export default function SummaryPage() {
  const dispatch = useAppDispatch()
  const [monthFilterOption, setMonthFilterOption] =
    useState<IOption>(NOW_MONTH_OPTION)

  useEffect(() => {
    dispatch(getAllPayments())
  }, [])

  return (
    <SummaryFilterContext.Provider
      value={{
        monthFilterOption,
        setMonthFilterOption,
      }}
    >
      <div className="flex-1 p-3 ">
        <FilterSection />
        <TotalSummarySection />
      </div>
    </SummaryFilterContext.Provider>
  )
}
