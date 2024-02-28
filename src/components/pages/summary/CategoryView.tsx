import Image from 'next/image'
import { useMemo } from 'react'

// *INFO: internal modules
import { EPaymentCategory } from '@/enums'
import { IPayment } from '@/interfaces'
import { isEmptyArray } from '@/utils'
import { CATEGORY_OPTIONS } from '../home/constants'

interface ICategoryViewProps {
  payments: IPayment[]
}

export default function CategoryView(props: Readonly<ICategoryViewProps>) {
  const { payments } = props

  const groupByCategory = useMemo(() => {
    const paymentGroupObj = payments.reduce((group, item) => {
      const { category } = item
      group[category] = group[category] ?? []
      group[category].push(item)
      return group
    }, {} as any)

    return Object.keys(paymentGroupObj).map((key) => {
      const total = paymentGroupObj[key].reduce(
        (acc: number, currentValue: IPayment) => acc + currentValue.price,
        0,
      )

      return {
        category: parseInt(key),
        total,
      }
    })
  }, [payments])

  function getIconSrc(category: EPaymentCategory): string {
    return CATEGORY_OPTIONS.find((item) => item.value === category)?.iconSrc!
  }

  return (
    <div className="flex-col">
      {isEmptyArray(groupByCategory) ? (
        <p className="text-lg">Chưa tiêu xèn nào ^^</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {groupByCategory.map((item, index) => {
            return (
              <div key={index}>
                <div className="flex items-center">
                  <Image
                    className="w-6 h-6 mr-2"
                    src={getIconSrc(item.category)}
                    width={6}
                    height={6}
                    alt="icon"
                  />
                  <span>{item.total}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
