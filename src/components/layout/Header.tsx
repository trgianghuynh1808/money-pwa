import AvatarDropdown from './AvatarDropdown'

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-3">
      <h2 className="text-2xl font-semibold text-purple-800 sm:text-3xl sm:tracking-tight">
        Ting Ting ^.^~
      </h2>
      <AvatarDropdown />
    </header>
  )
}
