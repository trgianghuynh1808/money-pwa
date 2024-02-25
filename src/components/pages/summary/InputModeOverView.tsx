import Image from 'next/image'

// *INFO: internal modules
import { INPUT_MODE_SRC_MAP } from '@/constants'
import { EInputMode } from '@/enums'

interface IInputModeOverviewProps {
  mode: EInputMode
}

export default function InputModeOverview(
  props: Readonly<IInputModeOverviewProps>,
) {
  const { mode } = props
  const inputImgSrc = getInputImgSrc(mode)

  function getInputImgSrc(currentMode: EInputMode): string {
    switch (currentMode) {
      case EInputMode.BOY:
        return INPUT_MODE_SRC_MAP.BOY
      case EInputMode.GIRL:
        return INPUT_MODE_SRC_MAP.GIRL
      case EInputMode.FAMILY:
        return INPUT_MODE_SRC_MAP.FAMILY
      default:
        return INPUT_MODE_SRC_MAP.GIRL
    }
  }

  return (
    <div className="flex rounded-lg bg-white shadow-md p-2 items-center">
      <Image
        className="w-10 h-10 mr-2 rounded-lg"
        src={inputImgSrc}
        width={6}
        height={6}
        alt="icon"
      />
      <p>1000</p>
    </div>
  )
}
