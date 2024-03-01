import { Dialog, Transition } from '@headlessui/react'
import dayjs from 'dayjs'
import Image from 'next/image'
import { Dispatch, Fragment, SetStateAction, useMemo } from 'react'

// *INFO: internal modules
import { EPaymentCategory } from '@/enums'
import { IPayment } from '@/interfaces'
import { formatNumberWithCommas, getValidArray } from '@/utils'
import { CATEGORY_OPTIONS } from '../home/constants'

interface IDayViewProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  payments: IPayment[]
}

export default function DayViewModal(
  props: Readonly<IDayViewProps>,
): JSX.Element {
  const { payments, isOpen, setIsOpen } = props

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

  function calculateTotal(currentPayments: IPayment[]): number {
    return getValidArray(currentPayments).reduce((acc, item: IPayment) => {
      return acc + item.price
    }, 0)
  }

  function closeModal(): void {
    setIsOpen(false)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col gap-3">
                  {groupByDay.map((item, index) => {
                    return (
                      <div key={index}>
                        <div className="flex justify-start gap-1">
                          <p className="text-base font-semibold text-gray-600 underline underline-offset-1 mb-1">
                            {item.day}
                          </p>
                          <p className="text-blue-900 font-semibold">
                            -{' '}
                            {formatNumberWithCommas(
                              calculateTotal(item.payments),
                            )}
                            K
                          </p>
                        </div>

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

                                  <p>{formatNumberWithCommas(payment.price)}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
