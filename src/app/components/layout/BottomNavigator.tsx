import { ExploreIcon, HomeIcon } from '../icons'

export default function BottomTabNavigator() {
  return (
    <section id="bottom-navigation" className="w-full bg-violet-600 shadow">
      <div id="tabs" className="flex justify-between">
        <a
          href="#"
          className="w-full text-white focus:font-bold hover:font-bold justify-center inline-block text-center pt-2 pb-1"
        >
          <HomeIcon />
          <span className="tab tab-home block text-md">Trang chủ</span>
        </a>
        <a
          href="#"
          className="w-full text-white focus:font-bold hover:font-bold justify-center inline-block text-center pt-2 pb-1"
        >
          <ExploreIcon />
          <span className="tab tab-kategori block text-md">Danh sách</span>
        </a>
      </div>
    </section>
  )
}
