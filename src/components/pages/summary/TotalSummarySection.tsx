import { useMemo } from 'react'

// *INFO: internal modules
import { PRICE_UNIT } from '@/constants'
import { EInputMode } from '@/enums'
import { useAppSelector } from '@/store'
import InputModeOverview from './InputModeOverView'
import { INPUT_MODE_VIEWABLE } from './constants'
import { calculateTotalByInputMode } from './utils'
import { formatNumberWithCommas } from '@/utils'

export default function TotalSummarySection() {
  const { paymentsInMonth } = useAppSelector((state) => state.payments)

  const totalPayment = useMemo(() => {
    return calculateTotalByInputMode(paymentsInMonth, EInputMode.ALL)
  }, [paymentsInMonth])

  return (
    <section className="w-full rounded-lg bg-blue-100 shadow-md p-3">
      <p className="text-center mb-2 text-xl font-semibold text-blue-800">
        <span>Tổng: </span>
        {formatNumberWithCommas(totalPayment)}
        <span> ({PRICE_UNIT})</span>
      </p>
      <div className="grid grid-cols-2 gap-2">
        {INPUT_MODE_VIEWABLE.map((item, index) => {
          return <InputModeOverview mode={item} key={index} />
        })}
      </div>
    </section>
  )
}
