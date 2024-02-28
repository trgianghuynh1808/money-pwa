import { useContext, useMemo, useState } from 'react'

// *INFO: internal modules
import { useAppSelector } from '@/store'
import { getValidArray } from '@/utils'
import { SummaryFilterContext } from './summaryFilter.context'
import CategoryView from './CategoryView'
import { EyeIcon, EyeSlashIcon } from '@/components/icons'
import DayView from './DayView'

export default function SummaryDetailsSection() {
  const { paymentsInMonth } = useAppSelector((state) => state.payments)
  const { viewMode } = useContext(SummaryFilterContext)
  const paymentsInViewMode = useMemo(() => {
    return getValidArray(paymentsInMonth).filter(
      (item) => item.mode === (viewMode as any),
    )
  }, [paymentsInMonth, viewMode])

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
      <div
        className="w-full flex justify-end text-gray-600"
        onClick={toggleShowDetails}
      >
        {!showDetails ? <EyeSlashIcon /> : <EyeIcon />}
      </div>
      {!showDetails ? (
        <CategoryView payments={paymentsInViewMode} />
      ) : (
        <DayView payments={paymentsInViewMode} />
      )}
    </section>
  )
}
