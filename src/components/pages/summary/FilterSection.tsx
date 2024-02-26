import { useContext } from 'react'

// *INFO: internal modules
import MonthFilterLightBox from './MonthFilterLightBox'
import { SummaryFilterContext } from './summaryFilter.context'

const monthOptions = Array.from(Array(10).keys()).map((item) => {
  return {
    label: `Tháng ${item + 1}`,
    value: item,
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
