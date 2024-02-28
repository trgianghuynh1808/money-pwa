import dayjs from 'dayjs'
import Image from 'next/image'
import { useMemo } from 'react'

// *INFO: internal modules
import { EPaymentCategory } from '@/enums'
import { IPayment } from '@/interfaces'
import { getValidArray } from '@/utils'
import { CATEGORY_OPTIONS } from '../home/constants'

interface IDayViewProps {
  payments: IPayment[]
}

export default function DayView(props: Readonly<IDayViewProps>): JSX.Element {
  const { payments } = props

  const groupByDay = useMemo(() => {
    const paymentGroupObj = getValidArray(payments).reduce((group, item) => {
      const day = dayjs(item.payment_at).format('DD/MM/YYYY')
      group[day] = group[day] ?? []
      group[day].push(item)

      return group
    }, {} as any)

    return Object.keys(paymentGroupObj)
      .map((key) => {
        return {
          day: key,
          payments: paymentGroupObj[key],
        }
      })
      .sort((a, b) => {
        const [aDay] = a.day.split('/')
        const [bDay] = b.day.split('/')

        return parseInt(bDay) - parseInt(aDay)
      })
  }, [payments])

  function getIconSrc(category: EPaymentCategory): string {
    return CATEGORY_OPTIONS.find((item) => item.value === category)?.iconSrc!
  }

  return (
    <div className="flex flex-col gap-3">
      {groupByDay.map((item, index) => {
        return (
          <div key={index}>
            <p className="text-base font-semibold text-gray-600 underline underline-offset-1 mb-1">
              {item.day}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {getValidArray(item.payments).map((payment) => {
                return (
                  <div key={payment.id}>
                    <div className="flex items-center">
                      <Image
                        className="w-6 h-6 mr-2"
                        src={getIconSrc(payment.category)}
                        width={6}
                        height={6}
                        alt="icon"
                      />

                      <p>{payment.price}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
