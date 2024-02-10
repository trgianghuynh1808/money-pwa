import { useState } from 'react'

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

  function onClickAddBtn(): void {
    setIsOpenAddPaymentModal(true)
  }

  function handleSubmitForm(): void {
    console.log({ price })
    setPrice('')
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

      <div className="col-span-3">
        <CategoryLightBox
          options={CATEGORY_OPTIONS}
          selectedOption={paymentCategoryOption}
          setSelectedOption={setPaymentCategoryOption}
        />
      </div>
      <div className="col-span-1">
        <button
          className="inline-flex items-center justify-center w-full h-full text-base font-medium text-center text-indigo-100 border border-indigo-500 rounded-lg shadow-sm cursor-pointer hover:text-white bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-500"
          onClick={onClickAddBtn}
        >
          <span className="relative">Thêm</span>
        </button>
      </div>
    </div>
  )
}
