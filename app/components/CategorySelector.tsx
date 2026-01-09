'use client'

import {
  IconChefHat, IconBus, IconFirstAidKit, IconSchool, IconBuildingCarousel,
  IconShirt, IconHome, IconBulb, IconCoin, IconChartLine, IconGift,
  IconPigMoney, IconBuildingBank, IconCoins, IconGrain, IconBriefcase,
  IconBuildingStore, IconShieldCheck, IconDeviceTv, IconScissors, IconPaw,
  IconArmchair, IconCreditCard
} from '@tabler/icons-react'

type Category = {
  id: number
  name: string
  icon: React.ReactNode
  color: string
}

type CategorySelectorProps = {
  selectedCategory: number
  onChange: (categoryId: number) => void
  type: 'expense' | 'income'
  error?: string
  disabled?: boolean
}

const expenseCategories: Category[] = [
  { id: 1, name: 'Comida', icon: <IconChefHat size={24} />, color: '#F59E0B' },
  { id: 2, name: 'Transporte', icon: <IconBus size={24} />, color: '#3B82F6' },
  { id: 3, name: 'Salud', icon: <IconFirstAidKit size={24} />, color: '#EF4444' },
  { id: 4, name: 'Educación', icon: <IconSchool size={24} />, color: '#8B5CF6' },
  { id: 5, name: 'Entretenimiento', icon: <IconBuildingCarousel size={24} />, color: '#EC4899' },
  { id: 6, name: 'Ropa', icon: <IconShirt size={24} />, color: '#06B6D4' },
  { id: 7, name: 'Alquiler', icon: <IconHome size={24} />, color: '#14B8A6' },
  { id: 8, name: 'Servicios', icon: <IconBulb size={24} />, color: '#F59E0B' },
  { id: 14, name: 'Seguros', icon: <IconShieldCheck size={24} />, color: '#3B82F6' },
  { id: 16, name: 'Subscripciones', icon: <IconDeviceTv size={24} />, color: '#8B5CF6' },
  { id: 17, name: 'Cuidado Personal', icon: <IconScissors size={24} />, color: '#EC4899' },
  { id: 18, name: 'Mascotas', icon: <IconPaw size={24} />, color: '#F97316' },
  { id: 19, name: 'Hogar', icon: <IconArmchair size={24} />, color: '#059669' },
  { id: 20, name: 'Deuda', icon: <IconCreditCard size={24} />, color: '#DC2626' },
  { id: 15, name: 'Otro', icon: <IconGrain size={24} />, color: '#64748B' },
]

const incomeCategories: Category[] = [
  { id: 9, name: 'Salario', icon: <IconCoin size={24} />, color: '#10B981' },
  { id: 10, name: 'Inversión', icon: <IconChartLine size={24} />, color: '#059669' },
  { id: 11, name: 'Regalo', icon: <IconGift size={24} />, color: '#EC4899' },
  { id: 21, name: 'Freelance', icon: <IconBriefcase size={24} />, color: '#8B5CF6' },
  { id: 22, name: 'Negocio', icon: <IconBuildingStore size={24} />, color: '#3B82F6' },
  { id: 7, name: 'Alquiler', icon: <IconHome size={24} />, color: '#14B8A6' },
  { id: 15, name: 'Otro', icon: <IconGrain size={24} />, color: '#64748B' },
]

export default function CategorySelector({
  selectedCategory,
  onChange,
  type,
  error,
  disabled = false
}: CategorySelectorProps) {
  const categories = type === 'expense' ? expenseCategories : incomeCategories

  return (
    <div className="mb-3">
      <label className="form-label">
        Categoría <span className="text-danger">*</span>
      </label>
      <div className="category-selector">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-option ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => !disabled && onChange(category.id)}
            disabled={disabled}
            style={{
              borderColor: selectedCategory === category.id ? category.color : undefined,
              backgroundColor: selectedCategory === category.id ? `${category.color}15` : undefined
            }}
          >
            <div
              className="category-option-icon"
              style={{ color: category.color }}
            >
              {category.icon}
            </div>
            <div className="category-option-label">
              {category.name}
            </div>
          </button>
        ))}
      </div>
      {error && <div className="invalid-feedback d-block mt-2">{error}</div>}
    </div>
  )
}
