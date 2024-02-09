import CategoryLightBox from './CategoryLightBox'

export default function PaymentForm() {
  function onClickAddBtn(): void {
    prompt('Nhập: ')
  }

  return (
    <div className="grid grid-cols-4 gap-4 ">
      <div className="col-span-3">
        <CategoryLightBox />
      </div>
      <div className="col-span-1">
        <button
          className="inline-flex items-center justify-center w-full h-full text-base font-medium text-center text-indigo-100 border border-indigo-500 rounded-lg shadow-sm cursor-pointer hover:text-white bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-500"
          onClick={onClickAddBtn}
        >
          <span className="relative">Thêm</span>
        </button>
      </div>
    </div>
  )
}
