import dayjs from 'dayjs'
import Image from 'next/image'
import { useContext } from 'react'

//*INFO: internal modules
import { EPaymentCategory } from '@/enums'
import { IPayment } from '@/interfaces'
import { CATEGORY_OPTIONS, EPaymentFormMode } from './constants'
import { PaymentFormContext } from './paymentForm.context'

interface IPaymentItemProps {
  data: IPayment
}

export default function PaymentItem(props: Readonly<IPaymentItemProps>) {
  const { data } = props
  const { setPrice, setFormMode, setShowPaymentModal, setSelectedKey } =
    useContext(PaymentFormContext)

  function getIconSrc(category: EPaymentCategory): string {
    return CATEGORY_OPTIONS.find((item) => item.value === category)?.iconSrc!
  }

  function onClickItem(): void {
    setPrice(`${data.price ?? ''}`)
    setFormMode(EPaymentFormMode.UPDATE)
    setSelectedKey(data.id)
    setShowPaymentModal(true)
  }

  return (
    <div
      className="w-full rounded-lg bg-white shadow-md flex justify-between p-3 items-center"
      onClick={onClickItem}
    >
      <div className="flex items-center">
        <Image
          className="w-6 h-6 mr-2"
          src={getIconSrc(data.category)}
          width={6}
          height={6}
          alt="icon"
        />
        <p className="text-xl font-semibold mr-0.5 text-violet-500">
          {data?.price ?? 0}
        </p>
      </div>

      <p className="text-sm font-normal text-gray-700">
        {dayjs(data.updated_at).format('DD/MM, HH:mm:ss')}
      </p>
    </div>
  )
}
