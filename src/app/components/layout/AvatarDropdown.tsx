import { AppContext } from '@/app/contexts'
import { EInputMode } from '@/app/enums'
import { useInternetStatus } from '@/app/hooks'
import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment, useContext, useEffect } from 'react'

const avatarMap = {
  GIRL: '/images/girl.webp',
  BOY: '/images/boy.png',
  FAMILY: '/images/family.webp',
  ALL: '/images/all-money.jpg',
}

const INPUT_OPTIONS = [
  {
    label: 'Vợ Iu',
    value: EInputMode.GIRL,
    avatarSrc: avatarMap.GIRL,
  },
  {
    label: 'Bòa Bòa',
    value: EInputMode.BOY,
    avatarSrc: avatarMap.BOY,
  },
  {
    label: 'Gia Đình Nhỏ',
    value: EInputMode.FAMILY,
    avatarSrc: avatarMap.FAMILY,
  },
]
export default function AvatarDropdown() {
  const { inputMode, setInputMode } = useContext(AppContext)
  const { isOnline } = useInternetStatus()

  function getAvatarSrc(currentInputMode: EInputMode): string {
    return (
      INPUT_OPTIONS.find((option) => option.value === currentInputMode)
        ?.avatarSrc ?? avatarMap.ALL
    )
  }

  return (
    <div className="w-56 text-right">
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
              <span
                className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'} border-2 border-white absolute bottom-0.5 right-0.5`}
              ></span>
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
          <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              {INPUT_OPTIONS.map((item, index) => {
                return (
                  <Menu.Item key={index}>
                    <button
                      className={`${
                        inputMode === item.value
                          ? 'bg-violet-500 text-white'
                          : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => setInputMode(item.value)}
                    >
                      {item.label}
                    </button>
                  </Menu.Item>
                )
              })}
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                <button
                  className={`${inputMode === EInputMode.ALL ? 'bg-violet-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => setInputMode(EInputMode.ALL)}
                >
                  Tất Cả
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
