import { useContext } from 'react'

// *INFO: internal modules
import MonthFilterLightBox from './MonthFilterLightBox'
import { SummaryFilterContext } from './summaryFilter.context'

const monthOptions = Array.from({ length: 12 }, (_, i) => {
  return {
    value: i,
    label: `Tháng ${i + 1}`,
  }
})

export default function FilterSection() {
  const { monthFilterOption, setMonthFilterOption } =
    useContext(SummaryFilterContext)

  return (
    <section className="w-full mb-3">
      <MonthFilterLightBox
        options={monthOptions}
        selectedOption={monthFilterOption}
        setSelectedOption={setMonthFilterOption}
      />
    </section>
  )
}
