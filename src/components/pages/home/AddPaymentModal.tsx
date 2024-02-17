import {
  Dispatch,
  FormEvent,
  Fragment,
  SetStateAction,
  useContext,
} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PaymentFormContext } from './paymentForm.context'
import { PRICE_UNIT } from '@/constants'

interface IAddPaymentModalProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  handleOnSubmit: () => void
}

export default function AddPaymentModal(
  props: Readonly<IAddPaymentModalProps>,
) {
  const { isOpen, setIsOpen, handleOnSubmit } = props
  const { price, setPrice } = useContext(PaymentFormContext)

  function closeModal(): void {
    setIsOpen(false)
  }

  function onSubmit(event: FormEvent): void {
    event.preventDefault()
    handleOnSubmit()
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
                <form onSubmit={onSubmit}>
                  <div className="relative">
                    <p className="text-sm text-gray-500">
                      Lần này là bao nhiêu xèn đấy?
                    </p>
                    <input
                      className="mt-2 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="inline-full-name"
                      type="tel"
                      placeholder="Ghi vô nào"
                      autoFocus
                      value={price}
                      onChange={(event) =>
                        setPrice(event.target.value.replace(/[^0-9]/g, ''))
                      }
                    />
                    <span className="absolute right-2 bottom-2.5 text-sm text-gray-500">
                      ({PRICE_UNIT})
                    </span>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 w-full py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-30"
                      onClick={closeModal}
                      disabled={!price}
                    >
                      Okay
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
