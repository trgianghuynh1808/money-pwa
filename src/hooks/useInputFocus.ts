import { Ref, useRef } from 'react'

export function useInputFocus(): [Ref<HTMLInputElement>, Function] {
  const inputRef = useRef<HTMLInputElement>(null)

  const setFocus = () => {
    inputRef.current && inputRef.current.focus()
  }

  return [inputRef, setFocus]
}
