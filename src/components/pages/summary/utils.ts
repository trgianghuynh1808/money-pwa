import { EInputMode } from '@/enums'
import { IPayment } from '@/interfaces'
import { getValidArray } from '@/utils'

export function calculateTotalByInputMode(
  payments: IPayment[],
  mode: EInputMode,
): number {
  const filteredPayments = getValidArray(payments).filter((item) => {
    if (mode === EInputMode.ALL) {
      return true
    }

    return mode === item.mode
  })

  return filteredPayments.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price,
    0,
  )
}
