import Image from 'next/image'
import { useContext, useMemo } from 'react'

// *INFO: internal modules
import { INPUT_MODE_SRC_MAP } from '@/constants'
import { EViewMode } from '@/enums'
import { useAppSelector } from '@/store'
import { formatNumberWithCommas } from '@/utils'
import { SummaryFilterContext } from './summaryFilter.context'
import { calculateTotalByInputMode } from './utils'

interface IInputModeOverviewProps {
  mode: EViewMode
}

export default function InputModeOverview(
  props: Readonly<IInputModeOverviewProps>,
) {
  const { mode } = props
  const inputImgSrc = getInputImgSrc(mode)
  const { paymentsInMonth } = useAppSelector((state) => state.payments)
  const { viewMode, setViewMode } = useContext(SummaryFilterContext)

  const totalPayment = useMemo(() => {
    return calculateTotalByInputMode(paymentsInMonth, mode as any)
  }, [paymentsInMonth, mode])
  const isActive = useMemo(() => {
    return viewMode === mode
  }, [viewMode, mode])

  function getInputImgSrc(currentMode: EViewMode): string {
    switch (currentMode) {
      case EViewMode.BOY:
        return INPUT_MODE_SRC_MAP.BOY
      case EViewMode.GIRL:
        return INPUT_MODE_SRC_MAP.GIRL
      case EViewMode.FAMILY:
        return INPUT_MODE_SRC_MAP.FAMILY
      default:
        return INPUT_MODE_SRC_MAP.GIRL
    }
  }

  function onClickViewMode(): void {
    setViewMode(mode)
  }

  return (
    <div
      className={`flex rounded-lg bg-white shadow-md p-2 items-center ${mode === EViewMode.FAMILY ? 'col-span-2 justify-center' : 'col-span-1'} ${isActive ? ' text-purple-900 font-semibold underline underline-offset-1' : ''}`}
      onClick={onClickViewMode}
    >
      <Image
        className="w-10 h-10 mr-2 rounded-lg"
        src={inputImgSrc}
        width={6}
        height={6}
        alt="icon"
      />
      <p>{formatNumberWithCommas(totalPayment)}K</p>
    </div>
  )
}
