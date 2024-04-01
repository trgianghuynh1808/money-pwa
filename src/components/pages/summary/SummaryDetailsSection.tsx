import dayjs from 'dayjs'
import { useContext, useMemo, useState } from 'react'

// *INFO: internal modules
import { EyeIcon, EyeSlashIcon } from '@/components/icons'
import { useAppSelector } from '@/store'
import { getValidArray, isEmptyArray } from '@/utils'
import CategoryView from './CategoryView'
import DayViewModal from './DayViewModal'
import { SummaryFilterContext } from './summaryFilter.context'

export default function SummaryDetailsSection() {
  const { paymentsInMonth, paymentsFiltered } = useAppSelector(
    (state) => state.payments,
  )
  const { viewMode, monthFilterOption } = useContext(SummaryFilterContext)

  const isFilterLastMonth = useMemo(() => {
    const nowMonth = dayjs().month()
    return monthFilterOption.value !== nowMonth
  }, [monthFilterOption])
  const paymentsData = useMemo(() => {
    return isFilterLastMonth ? paymentsFiltered : paymentsInMonth
  }, [isFilterLastMonth, paymentsFiltered, paymentsInMonth])

  const paymentsInViewMode = useMemo(() => {
    return getValidArray(paymentsData).filter(
      (item) => item.mode === (viewMode as any),
    )
  }, [paymentsData, viewMode])

  const [showDetails, setShowDetails] = useState<boolean>(false)

  function toggleShowDetails(): void {
    setShowDetails((prev) => !prev)
  }

  if (viewMode === undefined) {
    return <></>
  }

  return (
    <section
      className="w-full rounded-lg shadow-md p-3 mt-4"
      style={{ height: showDetails ? '400px' : 'auto', overflowY: 'auto' }}
    >
      {!isEmptyArray(paymentsInViewMode) && (
        <div
          className="w-full flex justify-end text-gray-600"
          onClick={toggleShowDetails}
        >
          {!showDetails ? <EyeSlashIcon /> : <EyeIcon />}
        </div>
      )}

      <CategoryView payments={paymentsInViewMode} />
      <DayViewModal
        isOpen={showDetails}
        setIsOpen={setShowDetails}
        payments={paymentsInViewMode}
      />
    </section>
  )
}
