import { SetStateAction, createContext, Dispatch } from 'react'

// *INFO: internal modules
import { EInputMode } from '../enums'

interface IAppContext {
  inputMode: EInputMode
  setInputMode: Dispatch<SetStateAction<EInputMode>>
}

export const AppContext = createContext<IAppContext>({
  inputMode: EInputMode.GIRL,
  setInputMode: () => {},
})
