import { Dispatch, SetStateAction, createContext } from 'react'
import dayjs from 'dayjs'

// *INFO: internal modules
import { IOption } from '@/interfaces'
import { EViewMode } from '@/enums'

interface ISummaryFilterContext {
  monthFilterOption: IOption
  setMonthFilterOption: Dispatch<SetStateAction<IOption>>
  viewMode?: EViewMode
  setViewMode: Dispatch<SetStateAction<EViewMode | undefined>>
}

const nowMonth = dayjs().month()

export const NOW_MONTH_OPTION: IOption = {
  label: `Tháng ${nowMonth + 1}`,
  value: nowMonth,
}

export const SummaryFilterContext = createContext<ISummaryFilterContext>({
  monthFilterOption: NOW_MONTH_OPTION,
  setMonthFilterOption: () => {},
  viewMode: undefined,
  setViewMode: () => {},
})
