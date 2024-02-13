import { useMemo, useState } from 'react'
import DatePicker, { DateValueType } from 'react-tailwindcss-datepicker'
import dayjs from 'dayjs'

// *INFO: internal modules
import CategoryLightBox from './CategoryLightBox'
import { CATEGORY_OPTIONS } from './constants'
import AddPaymentModal from './AddPaymentModal'

export default function PaymentForm() {
  const [isOpenAddPaymentModal, setIsOpenAddPaymentModal] =
    useState<boolean>(false)
  const [paymentCategoryOption, setPaymentCategoryOption] = useState(
    CATEGORY_OPTIONS[0],
  )
  const [price, setPrice] = useState<string>('')
  const [pickDate, setPickDate] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  })
  const isValidDate = useMemo(() => {
    return Boolean(pickDate?.startDate) && Boolean(pickDate?.endDate)
  }, [pickDate])

  function onClickAddBtn(): void {
    setIsOpenAddPaymentModal(true)
  }

  function handleSubmitForm(): void {
    setPrice('')
  }

  function onChangePicker(newValue: DateValueType): void {
    setPickDate(newValue)
  }

  return (
    <div className="grid grid-cols-4 gap-4 ">
      <AddPaymentModal
        isOpen={isOpenAddPaymentModal}
        setIsOpen={setIsOpenAddPaymentModal}
        price={price}
        setPrice={setPrice}
        handleOnSubmit={handleSubmitForm}
      />

      <div className="col-span-4">
        <DatePicker
          primaryColor="purple"
          containerClassName="relative w-full cursor-default rounded-lg shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          useRange={false}
          asSingle={true}
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
          disabled={!isValidDate}
          onClick={onClickAddBtn}
        >
          <span className="relative">Thêm</span>
        </button>
      </div>
    </div>
  )
}
