import { Dispatch, SetStateAction, createContext } from 'react'
import { DateValueType } from 'react-tailwindcss-datepicker'

// *INFO: internal modules
import { IOption } from '@/interfaces'
import { CATEGORY_OPTIONS, EPaymentFormMode } from './constants'

interface IPaymentFormContext {
  paymentCategoryOption: IOption
  setPaymentCategoryOption: Dispatch<SetStateAction<IOption>>
  price: string
  setPrice: Dispatch<SetStateAction<string>>
  pickDate: DateValueType
  setPickDate: Dispatch<SetStateAction<DateValueType>>
  formMode: EPaymentFormMode
  setFormMode: Dispatch<SetStateAction<EPaymentFormMode>>
  showPaymentModal: boolean
  setShowPaymentModal: Dispatch<SetStateAction<boolean>>
}

export const PaymentFormContext = createContext<IPaymentFormContext>({
  paymentCategoryOption: CATEGORY_OPTIONS[0],
  setPaymentCategoryOption: () => {},
  price: '',
  setPrice: () => {},
  pickDate: {
    startDate: new Date(),
    endDate: new Date(),
  },
  setPickDate: () => {},
  formMode: EPaymentFormMode.ADD,
  setFormMode: () => {},
  showPaymentModal: false,
  setShowPaymentModal: () => {},
})
