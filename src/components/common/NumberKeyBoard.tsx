import { Dispatch, SetStateAction } from 'react'

const AC_KEY = 'AC'
const DELETE_KEY = 'X'

const KEY_MAP = [
  ...Array.from(Array(10).keys())
    .filter((x) => x > 0)
    .map((x) => x.toString()),
  AC_KEY,
  '0',
  DELETE_KEY,
]

interface INumberKeyBoardProps {
  setInputValue: Dispatch<SetStateAction<string>>
}

export default function NumbericKeyBoard(
  props: Readonly<INumberKeyBoardProps>,
) {
  const { setInputValue } = props

  function onClickKey(key: string): void {
    if (key === AC_KEY) {
      return setInputValue('')
    }

    if (key === DELETE_KEY) {
      return setInputValue((prev) => prev.slice(0, -1))
    }

    return setInputValue((prev) => prev + key)
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {KEY_MAP.map((key) => {
        return (
          <div
            className="text-center rounded-md bg-blue-500 active:bg-blue-700 text-white py-1.5"
            key={key}
            onClick={() => onClickKey(key)}
          >
            {key}
          </div>
        )
      })}
    </div>
  )
}
