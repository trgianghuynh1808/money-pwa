import dayjs from 'dayjs'
import { useContext, useEffect, useMemo, useState } from 'react'
import DatePicker, { DateValueType } from 'react-tailwindcss-datepicker'

// *INFO: internal modules
import { AppContext } from '@/contexts'
import { useAppDispatch } from '@/store'
import { addPayment } from '@/store/features/payments/paymentThunk'
import AddPaymentModal from './AddPaymentModal'
import CategoryLightBox from './CategoryLightBox'
import { CATEGORY_OPTIONS } from './constants'
import { PaymentFormContext } from './paymentForm.context'
import { EInputMode } from '@/enums'

export default function PaymentForm() {
  const dispatch = useAppDispatch()
  const { inputMode } = useContext(AppContext)
  const {
    pickDate,
    price,
    paymentCategoryOption,
    setPaymentCategoryOption,
    setPrice,
    setPickDate,
  } = useContext(PaymentFormContext)
  const [isOpenAddPaymentModal, setIsOpenAddPaymentModal] =
    useState<boolean>(false)

  const [isMounted, setIsMounted] = useState<boolean>(false)

  const isValidDate = useMemo(() => {
    return Boolean(pickDate?.startDate) && Boolean(pickDate?.endDate)
  }, [pickDate])

  function onClickAddBtn(): void {
    setIsOpenAddPaymentModal(true)
  }

  async function handleSubmitForm(): Promise<void> {
    const payload = {
      price: parseInt(price),
      mode: inputMode,
      category: paymentCategoryOption.value,
      synced: false,
      payment_at: pickDate?.startDate as Date,
    }

    await dispatch(addPayment(payload))

    setPrice('')
  }

  function onChangePicker(newValue: DateValueType): void {
    setPickDate(newValue)
  }

  useEffect(() => {
    if (isMounted) {
      setIsOpenAddPaymentModal(true)
    }
  }, [paymentCategoryOption])

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
  }, [isMounted])

  return (
    <div className="grid grid-cols-4 gap-4 ">
      <AddPaymentModal
        isOpen={isOpenAddPaymentModal}
        setIsOpen={setIsOpenAddPaymentModal}
        handleOnSubmit={handleSubmitForm}
      />

      <div className="col-span-4">
        <DatePicker
          primaryColor="purple"
          containerClassName="relative w-full cursor-default rounded-lg shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          useRange={false}
          asSingle={true}
          readOnly={true}
          displayFormat={'DD/MM/YYYY'}
          minDate={dayjs().startOf('month').toDate()}
          maxDate={dayjs().toDate()}
          value={pickDate}
          onChange={onChangePicker}
        />
      </div>

      <div className="col-span-2">
        <CategoryLightBox
          options={CATEGORY_OPTIONS}
          selectedOption={paymentCategoryOption}
          setSelectedOption={setPaymentCategoryOption}
        />
      </div>
      <div className="col-span-2">
        <button
          className="inline-flex items-center justify-center w-full h-10 text-base font-medium text-center text-indigo-100 border border-indigo-500 rounded-lg shadow-sm cursor-pointer hover:text-white bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-500 disabled:opacity-30"
          disabled={!isValidDate || inputMode === EInputMode.ALL}
          onClick={onClickAddBtn}
        >
          <span className="relative">Thêm</span>
        </button>
      </div>
    </div>
  )
}
