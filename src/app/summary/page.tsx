'use client'
import { useEffect, useState } from 'react'

// *INFO: internal modules
import {
  FilterSection,
  SummaryDetailsSection,
  TotalSummarySection,
} from '@/components/pages/summary'
import {
  NOW_MONTH_OPTION,
  SummaryFilterContext,
} from '@/components/pages/summary/summaryFilter.context'
import { EViewMode } from '@/enums'
import { IOption } from '@/interfaces'
import { useAppDispatch } from '@/store'
import { getAllPayments } from '@/store/features/payments/paymentThunk'

export default function SummaryPage() {
  const dispatch = useAppDispatch()
  const [monthFilterOption, setMonthFilterOption] =
    useState<IOption>(NOW_MONTH_OPTION)
  const [viewMode, setViewMode] = useState<EViewMode>()

  useEffect(() => {
    dispatch(getAllPayments())
  }, [])

  return (
    <SummaryFilterContext.Provider
      value={{
        monthFilterOption,
        setMonthFilterOption,
        viewMode,
        setViewMode,
      }}
    >
      <div className="flex-1 p-3 ">
        <FilterSection />
        <TotalSummarySection />
        <SummaryDetailsSection />
      </div>
    </SummaryFilterContext.Provider>
  )
}
