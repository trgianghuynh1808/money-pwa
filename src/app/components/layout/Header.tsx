import AvatarDropdown from './AvatarDropdown'

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-3">
      <h2 className="text-2xl font-semibold leading-7 text-gray-800 sm:truncate sm:text-3xl sm:tracking-tight">
        Money
      </h2>
      <AvatarDropdown />
    </header>
  )
}
