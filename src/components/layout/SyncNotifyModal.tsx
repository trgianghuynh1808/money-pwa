import { Dialog, Transition } from '@headlessui/react'
import dayjs from 'dayjs'
import { Dispatch, Fragment, SetStateAction, useMemo } from 'react'

import { useAppSelector } from '@/store'

interface ISyncNotifyModalProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  succeed?: boolean
}

export default function SyncNotifyModal(
  props: Readonly<ISyncNotifyModalProps>,
) {
  const { isOpen, setIsOpen, succeed } = props
  const { currentSummary } = useAppSelector((state) => state.summaries)

  const syncedAt = useMemo(() => {
    return currentSummary
      ? dayjs(currentSummary.synced_at).format('DD/MM/YY HH:mm:ss')
      : undefined
  }, [currentSummary])

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                <div className="text-center">
                  {succeed ? (
                    <>
                      <p className="text-lg text-green-600">
                        Sync xong goy ^.^~
                      </p>
                      {syncedAt && (
                        <p className="text-xs text-gray-600">{syncedAt}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-red-500 text-lg">Mở Wifi ợ ợ ~.~</p>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
