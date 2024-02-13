import { EPaymentCategory } from '@/enums'
import { IOption } from '@/interfaces'

const CATEGORY_ICON_MAP = {
  FOOD: '/images/icons/food-icon.png',
  SHOPPING: '/images/icons/shopping-icon.png',
  PET: '/images/icons/cat-icon.png',
  FAMILY: '/images/icons/family-icon.png',
  COSMETICS: '/images/icons/cosmestic-icon.png',
  CLOTHES: '/images/icons/clothes-icon.jpg',
  HOUSE_WARE: '/images/icons/house-ware-icon.png',
  OTHER: '/images/icons/more-icon.png',
}

export const CATEGORY_OPTIONS: IOption[] = [
  {
    label: 'Ăn Uống',
    value: EPaymentCategory.FOOD,
    iconSrc: CATEGORY_ICON_MAP.FOOD,
  },
  {
    label: 'Siêu Thị',
    value: EPaymentCategory.SHOPPING,
    iconSrc: CATEGORY_ICON_MAP.SHOPPING,
  },
  {
    label: 'Bông',
    value: EPaymentCategory.PET,
    iconSrc: CATEGORY_ICON_MAP.PET,
  },
  {
    label: 'Gia Đình',
    value: EPaymentCategory.FAMILY,
    iconSrc: CATEGORY_ICON_MAP.FAMILY,
  },
  {
    label: 'Mỹ Phẩm',
    value: EPaymentCategory.COSMETICS,
    iconSrc: CATEGORY_ICON_MAP.COSMETICS,
  },
  {
    label: 'Quần Áo',
    value: EPaymentCategory.CLOTHES,
    iconSrc: CATEGORY_ICON_MAP.CLOTHES,
  },
  {
    label: 'Gia Dụng',
    value: EPaymentCategory.HOUSE_WARE,
    iconSrc: CATEGORY_ICON_MAP.HOUSE_WARE,
  },
  {
    label: 'Khác',
    value: EPaymentCategory.OTHER,
    iconSrc: CATEGORY_ICON_MAP.OTHER,
  },
]
