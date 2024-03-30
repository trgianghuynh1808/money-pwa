import { useCallback, useContext, useMemo } from 'react'
import dayjs from 'dayjs'

//*INFO: internal modules
import { useAppSelector } from '@/store'
import { PaymentFormContext } from './paymentForm.context'
import { getValidArray, isEmptyArray } from '@/utils'
import PaymentItem from './PaymentItem'
import { AppContext } from '@/contexts'
import { EInputMode } from '@/enums'

export default function PaymentList() {
  const { paymentsInMonth, paymentsInLastMonth } = useAppSelector(
    (state) => state.payments,
  )
  const { pickDate } = useContext(PaymentFormContext)
  const { inputMode } = useContext(AppContext)
  const existsPaymentsInLastMonth = useMemo(() => {
    return paymentsInLastMonth?.length > 0
  }, [paymentsInLastMonth])

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

  const PaymentList = useCallback(() => {
    if (isEmptyArray(filteredPayments)) {
      return <p className="text-xl">Chưa tiêu xèn nào ^^</p>
    }

    return (
      <>
        {filteredPayments.map((item, index) => (
          <PaymentItem data={item} key={index} />
        ))}
      </>
    )
  }, [filteredPayments])

  return (
    <div
      className="flex flex-col gap-2 overflow-y-auto items-center py-2"
      style={{ maxHeight: '60vh' }}
    >
      {existsPaymentsInLastMonth ? (
        <p className="text-xl">Archive data tháng trước đã ạ ^^~</p>
      ) : (
        <PaymentList />
      )}
    </div>
  )
}
