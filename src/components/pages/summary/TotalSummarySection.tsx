import { PRICE_UNIT } from '@/constants'
import { INPUT_MODE_VIEWABLE } from './constants'
import InputModeOverview from './InputModeOverView'

export default function TotalSummarySection() {
  return (
    <div className="w-full rounded-lg bg-blue-200 shadow-md p-3">
      <p className="text-center mb-2 text-xl font-semibold text-blue-800">
        3000 <span>({PRICE_UNIT})</span>
      </p>
      <div className="grid grid-cols-3 gap-3">
        {INPUT_MODE_VIEWABLE.map((item, index) => {
          return <InputModeOverview mode={item} key={index} />
        })}
      </div>
    </div>
  )
}
