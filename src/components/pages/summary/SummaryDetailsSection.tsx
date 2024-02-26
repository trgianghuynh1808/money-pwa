import { useContext, useMemo } from 'react'
import Image from 'next/image'

// *INFO: internal modules
import { IPayment } from '@/interfaces'
import { useAppSelector } from '@/store'
import { EPaymentCategory } from '@/enums'
import { CATEGORY_OPTIONS } from '../home/constants'
import { getValidArray, isEmptyArray } from '@/utils'
import { SummaryFilterContext } from './summaryFilter.context'

interface ICategoryViewProps {
  payments: IPayment[]
}

function CategoryView(props: Readonly<ICategoryViewProps>) {
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

export default function SummaryDetailsSection() {
  const { paymentsInMonth } = useAppSelector((state) => state.payments)
  const { viewMode } = useContext(SummaryFilterContext)
  const paymentsInViewMode = useMemo(() => {
    return getValidArray(paymentsInMonth).filter(
      (item) => item.mode === (viewMode as any),
    )
  }, [paymentsInMonth, viewMode])

  if (viewMode === undefined) {
    return <></>
  }

  return (
    <section className="w-full rounded-lg shadow-md p-3 mt-4">
      <CategoryView payments={paymentsInViewMode} />
    </section>
  )
}
