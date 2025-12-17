import { IncomeExpenseProps } from '@/types'
import { IconChefHat, IconBus, IconFirstAidKit, IconSchool, IconBuildingCarousel, IconShirt, IconHome, IconBulb, IconCoin, IconChartLine, IconGift, IconPigMoney, IconBuildingBank, IconCoins, IconGrain } from '@tabler/icons-react'

export default function IncomeExpenseCard({ description, amount, date, category }: IncomeExpenseProps) {

  const getIcon = () => {
    switch (category) {
      case 1: return <IconChefHat size={34} />
      case 2: return <IconBus size={34} />
      case 3: return <IconFirstAidKit size={34} />
      case 4: return <IconSchool size={34} />
      case 5: return <IconBuildingCarousel size={34} />
      case 6: return <IconShirt size={34} />
      case 7: return <IconHome size={34} />
      case 8: return <IconBulb size={34} />
      case 9: return <IconCoin size={34} />
      case 10: return <IconChartLine size={34} />
      case 11: return <IconGift size={34} />
      case 12: return <IconPigMoney size={34} />
      case 13: return <IconBuildingBank size={34} />
      case 14: return <IconCoins size={34} />
      case 15: return <IconGrain size={34} />
      default: return <IconGrain size={34} />
    }
  }

  return (
    <div className="container border-2 border-dark-subtle border-top">
      <div className="row my-3">
        <div className="col text-start">
          <div className="d-flex">
            <div className="">    
              {getIcon()}
            </div>
            <p className='ms-2 mt-1 mb-0 fs-5'>
              {description}
            </p>
          </div>        
          <span className='text-muted' style={{fontSize: '14px'}}>{date}</span>
        </div>
        <div className="col text-end">
          <p className='fs-5'>
            ₡{amount}
          </p>
        </div>
      </div>
    </div>
  )
}