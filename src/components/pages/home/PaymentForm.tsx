import dayjs from 'dayjs'
import { useContext, useEffect, useMemo, useState } from 'react'
import DatePicker, { DateValueType } from 'react-tailwindcss-datepicker'

// *INFO: internal modules
import { AppContext } from '@/contexts'
import { useAppDispatch, useAppSelector } from '@/store'
import { addPayment, editPayment } from '@/store/features/payments/paymentThunk'
import AddPaymentModal from './AddPaymentModal'
import CategoryLightBox from './CategoryLightBox'
import { CATEGORY_OPTIONS } from './constants'
import { PaymentFormContext } from './paymentForm.context'
import { EInputMode } from '@/enums'
import { getValidArray } from '@/utils'
import { IPayment, TAddPayload } from '@/interfaces'

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
  const { paymentsInMonth } = useAppSelector((state) => state.payments)
  const [isOpenAddPaymentModal, setIsOpenAddPaymentModal] =
    useState<boolean>(false)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const isValidDate = useMemo(() => {
    return Boolean(pickDate?.startDate) && Boolean(pickDate?.endDate)
  }, [pickDate])

  function onClickAddBtn(): void {
    prompt('test')
    // setIsOpenAddPaymentModal(true)
  }

  function getExistsPayment(): IPayment | undefined {
    return getValidArray(paymentsInMonth).find((item) => {
      const isCategory = item.category === paymentCategoryOption.value
      const isInputMode = item.mode === inputMode
      const isDate = dayjs(pickDate?.startDate).isSame(
        dayjs(item.payment_at),
        'day',
      )

      return isCategory && isInputMode && isDate
    })
  }

  async function handleAddPayment(existsPayment?: IPayment): Promise<void> {
    const priceNumber = parseInt(price)
    const payload: TAddPayload<IPayment> = {
      mode: inputMode,
      category: paymentCategoryOption.value,
      synced: false,
      payment_at: pickDate?.startDate as Date,
      updated_at: new Date(),
      price: !existsPayment ? priceNumber : existsPayment.price + priceNumber,
    }

    if (existsPayment) {
      await dispatch(editPayment({ key: existsPayment.id, payload }))
      return
    }

    await dispatch(addPayment(payload))
  }

  async function handleSubmitForm(): Promise<void> {
    const existsPayment = getExistsPayment()

    await handleAddPayment(existsPayment)
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
