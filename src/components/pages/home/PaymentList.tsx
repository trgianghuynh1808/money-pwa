import { useContext, useMemo } from 'react'
import dayjs from 'dayjs'

//*INFO: internal modules
import { useAppSelector } from '@/store'
import { PaymentFormContext } from './paymentForm.context'
import { getValidArray, isEmptyArray } from '@/utils'
import PaymentItem from './PaymentItem'
import { AppContext } from '@/contexts'
import { EInputMode } from '@/enums'

export default function PaymentList() {
  const { paymentsInMonth } = useAppSelector((state) => state.payments)
  const { pickDate } = useContext(PaymentFormContext)
  const { inputMode } = useContext(AppContext)

  const filteredPayments = useMemo(() => {
    return getValidArray(paymentsInMonth)
      .filter((item) => {
        const isFilterDate = dayjs(pickDate?.startDate).isSame(
          dayjs(item.payment_at),
          'day',
        )
        const isFilterInputMode =
          inputMode === EInputMode.ALL ? true : inputMode === item.mode

        return isFilterDate && isFilterInputMode
      })
      .sort((a, b) => {
        return b.updated_at!.getTime() - a.updated_at!.getTime()
      })
  }, [paymentsInMonth, pickDate, inputMode])

  return (
    <div
      className="flex flex-col gap-2 overflow-y-auto items-center py-2"
      style={{ maxHeight: '60vh' }}
    >
      {isEmptyArray(filteredPayments) ? (
        <p className="text-xl">Chưa tiêu xèn nào ^^</p>
      ) : (
        <>
          {filteredPayments.map((item, index) => (
            <PaymentItem data={item} key={index} />
          ))}
        </>
      )}
    </div>
  )
}
