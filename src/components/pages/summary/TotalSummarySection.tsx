import dayjs from 'dayjs'
import { useContext, useMemo } from 'react'

// *INFO: internal modules
import { PRICE_UNIT } from '@/constants'
import { EInputMode } from '@/enums'
import { useAppSelector } from '@/store'
import { formatNumberWithCommas } from '@/utils'
import InputModeOverview from './InputModeOverView'
import { VIEW_MODES } from './constants'
import { SummaryFilterContext } from './summaryFilter.context'
import { calculateTotalByInputMode } from './utils'

export default function TotalSummarySection() {
  const { monthFilterOption } = useContext(SummaryFilterContext)
  const { paymentsInMonth, paymentsFiltered } = useAppSelector(
    (state) => state.payments,
  )

  const isFilterLastMonth = useMemo(() => {
    const nowMonth = dayjs().month()
    return monthFilterOption.value !== nowMonth
  }, [monthFilterOption])
  const paymentsData = useMemo(() => {
    return isFilterLastMonth ? paymentsFiltered : paymentsInMonth
  }, [isFilterLastMonth, paymentsFiltered, paymentsInMonth])
  const totalPayment = useMemo(() => {
    return calculateTotalByInputMode(paymentsData, EInputMode.ALL)
  }, [paymentsData])

  return (
    <section className="w-full rounded-lg bg-blue-200 shadow-md p-3">
      <p className="text-center mb-2 text-xl font-semibold text-blue-800">
        <span>Tổng: </span>
        {formatNumberWithCommas(totalPayment)}
        <span> ({PRICE_UNIT})</span>
      </p>
      <div className="grid grid-cols-2 gap-2">
        {VIEW_MODES.map((item, index) => {
          return (
            <InputModeOverview
              mode={item}
              key={index}
              paymentsData={paymentsData}
            />
          )
        })}
      </div>
    </section>
  )
}
