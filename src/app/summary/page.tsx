'use client'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'

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
import {
  getPaymentsFiltered,
  getPaymentsInMonth,
} from '@/store/features/payments/paymentThunk'

export default function SummaryPage() {
  const dispatch = useAppDispatch()
  const [monthFilterOption, setMonthFilterOption] =
    useState<IOption>(NOW_MONTH_OPTION)
  const [viewMode, setViewMode] = useState<EViewMode>()
  const isFilterLastMonth = useMemo(() => {
    const nowMonth = dayjs().month()
    return monthFilterOption.value !== nowMonth
  }, [monthFilterOption])

  useEffect(() => {
    dispatch(getPaymentsInMonth())

    if (isFilterLastMonth) {
      dispatch(getPaymentsFiltered({ monthFilter: monthFilterOption.value }))
    }
  }, [monthFilterOption])

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
