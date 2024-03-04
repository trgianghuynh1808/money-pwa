import { Menu, Transition } from '@headlessui/react'
import dayjs from 'dayjs'
import Image from 'next/image'
import { Fragment, useContext, useMemo, useState } from 'react'

// *INFO: internal modules
import { INPUT_MODE_SRC_MAP } from '@/constants'
import { AppContext } from '@/contexts'
import { EInputMode } from '@/enums'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  syncPaymentsIntoOfflineDB,
  syncPaymentsIntoOnlineDB,
} from '@/store/features/payments/paymentThunk'
import SyncNotifyModal from './SyncNotifyModal'
import { addSummary, editSummary } from '@/store/features/summary/summaryThunk'

const INPUT_OPTIONS = [
  {
    label: 'Vợ Iu',
    value: EInputMode.GIRL,
    avatarSrc: INPUT_MODE_SRC_MAP.GIRL,
  },
  {
    label: 'Bòa Bòa',
    value: EInputMode.BOY,
    avatarSrc: INPUT_MODE_SRC_MAP.BOY,
  },
  {
    label: 'Gia Đình Nhỏ',
    value: EInputMode.FAMILY,
    avatarSrc: INPUT_MODE_SRC_MAP.FAMILY,
  },
]

export default function AvatarDropdown() {
  const { inputMode, setInputMode } = useContext(AppContext)
  const dispatch = useAppDispatch()
  const [showNotifyModal, setShowNotifyModal] = useState<boolean>(false)
  const [isSyncCompleted, setIsSyncCompleted] = useState<boolean>()

  const { currentSummary } = useAppSelector((state) => state.summaries)

  const syncedAt = useMemo(() => {
    return currentSummary
      ? dayjs(currentSummary.synced_at).format('DD/MM/YY HH:mm:ss')
      : undefined
  }, [currentSummary])

  function getAvatarSrc(currentInputMode: EInputMode): string {
    return (
      INPUT_OPTIONS.find((option) => option.value === currentInputMode)
        ?.avatarSrc ?? INPUT_MODE_SRC_MAP.ALL
    )
  }

  async function addOrEdit(succeed: boolean): Promise<void> {
    const payload = {
      synced_at: new Date(),
      succeed,
    }

    if (currentSummary) {
      await dispatch(
        editSummary({
          key: currentSummary.id,
          payload,
        }),
      )
    } else {
      await dispatch(addSummary(payload))
    }
  }

  async function handleSyncPayments(): Promise<void> {
    if (!window?.navigator?.onLine) {
      setIsSyncCompleted(false)
      await addOrEdit(false)
    } else {
      await dispatch(syncPaymentsIntoOnlineDB())
      await dispatch(syncPaymentsIntoOfflineDB())
      await addOrEdit(true)

      setIsSyncCompleted(true)
    }

    setShowNotifyModal(true)
  }

  return (
    <div className="text-right">
      <SyncNotifyModal
        isOpen={showNotifyModal}
        setIsOpen={setShowNotifyModal}
        succeed={isSyncCompleted}
      />
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button>
            <div className="relative inline-block">
              <Image
                className="w-14 h-14 rounded-full border-4 border-stone-200"
                src={getAvatarSrc(inputMode)}
                width={20}
                height={20}
                alt="avatar"
              />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
            <div className="px-1 py-1 ">
              {INPUT_OPTIONS.map((item, index) => {
                return (
                  <Menu.Item key={index}>
                    <button
                      className={`${
                        inputMode === item.value
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => setInputMode(item.value)}
                    >
                      {item.label}
                    </button>
                  </Menu.Item>
                )
              })}
              <Menu.Item>
                <button
                  className={`${inputMode === EInputMode.ALL ? 'bg-violet-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => setInputMode(EInputMode.ALL)}
                >
                  Tất Cả
                </button>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                <button
                  className={`text-gray-900 group flex w-full items-center rounded-md p-2 text-sm`}
                  onClick={handleSyncPayments}
                >
                  <div className="flex flex-col">
                    <p>Đồng Bộ Dữ Liệu</p>
                    {syncedAt && (
                      <p className="text-xs text-gray-600">{syncedAt}</p>
                    )}
                  </div>
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
