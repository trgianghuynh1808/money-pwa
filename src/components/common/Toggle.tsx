import { Switch } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'

interface IToggleProps {
  enabled: boolean
  setEnabled: Dispatch<SetStateAction<boolean>>
}

export default function Toggle(props: Readonly<IToggleProps>) {
  const { enabled, setEnabled } = props

  return (
    <div>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-blue-900' : 'bg-blue-700'}
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
      >
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  )
}
