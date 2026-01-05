'use client'

import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { IncomeExpenseProps } from '@/types'
import {
  IconChefHat, IconBus, IconFirstAidKit, IconSchool, IconBuildingCarousel,
  IconShirt, IconHome, IconBulb, IconCoin, IconChartLine, IconGift,
  IconPigMoney, IconBuildingBank, IconCoins, IconGrain,
  IconEdit, IconTrash
} from '@tabler/icons-react'
import Swal from 'sweetalert2'

export default function IncomeExpenseCard({ id, description, amount, date, category }: IncomeExpenseProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getIcon = () => {
    const size = 40
    switch (category) {
      case 1: return <IconChefHat size={size} />
      case 2: return <IconBus size={size} />
      case 3: return <IconFirstAidKit size={size} />
      case 4: return <IconSchool size={size} />
      case 5: return <IconBuildingCarousel size={size} />
      case 6: return <IconShirt size={size} />
      case 7: return <IconHome size={size} />
      case 8: return <IconBulb size={size} />
      case 9: return <IconCoin size={size} />
      case 10: return <IconChartLine size={size} />
      case 11: return <IconGift size={size} />
      case 12: return <IconPigMoney size={size} />
      case 13: return <IconBuildingBank size={size} />
      case 14: return <IconCoins size={size} />
      case 15: return <IconGrain size={size} />
      default: return <IconGrain size={size} />
    }
  }

  const getCategoryColor = () => {
    switch (category) {
      case 1: return '#F59E0B' // Comida - Amber
      case 2: return '#3B82F6' // Transporte - Blue
      case 3: return '#EF4444' // Salud - Red
      case 4: return '#8B5CF6' // Educación - Purple
      case 5: return '#EC4899' // Entretenimiento - Pink
      case 6: return '#06B6D4' // Ropa - Cyan
      case 7: return '#14B8A6' // Alquiler - Teal
      case 8: return '#F59E0B' // Servicios - Amber
      case 9: return '#10B981' // Salario - Emerald
      case 10: return '#059669' // Inversión - Green
      case 11: return '#EC4899' // Regalo - Pink
      case 12: return '#8B5CF6' // Ahorros - Purple
      case 13: return '#3B82F6' // Préstamos - Blue
      case 14: return '#10B981' // Seguro - Emerald
      case 15: return '#64748B' // Otro - Slate
      default: return '#64748B'
    }
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`
    }
    const years = Math.floor(diffDays / 365)
    return years === 1 ? 'Hace 1 año' : `Hace ${years} años`
  }

  const categoryColor = getCategoryColor()

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleting(true)
        // TODO: Call API to delete transaction
        setTimeout(() => {
          console.log('Delete transaction:', id)
          Swal.fire({
            title: 'Eliminado',
            text: 'La transacción ha sido eliminada',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        }, 300)
      }
    })
  }

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.dir === 'Left') {
        const offset = Math.min(0, Math.max(-100, eventData.deltaX))
        setSwipeOffset(offset)
        setIsSwiping(true)
      }
    },
    onSwiped: (eventData) => {
      if (eventData.dir === 'Left' && Math.abs(eventData.deltaX) > 100) {
        handleDelete()
      }
      setSwipeOffset(0)
      setIsSwiping(false)
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: false,
    delta: 10
  })

  return (
    <div className={`transaction-card-wrapper ${isSwiping ? 'swiping' : ''}`}>
      <div className="swipe-delete-background">
        <IconTrash size={24} />
      </div>
      <div
        {...swipeHandlers}
        className={`transaction-card ${isDeleting ? 'deleting' : ''}`}
        style={{
          borderLeftColor: categoryColor,
          transform: `translateX(${swipeOffset}px)`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <div className="transaction-card-content">
        <div className="transaction-info">
          <div className="transaction-icon" style={{ color: categoryColor }}>
            {getIcon()}
          </div>
          <div className="transaction-details">
            <p className="transaction-description">{description}</p>
            <span className="transaction-date">{formatRelativeDate(date)}</span>
          </div>
        </div>

        <div className="transaction-right">
          <p className="transaction-amount">₡{Number(amount).toFixed(2)}</p>

          <div className={`transaction-actions ${isHovered ? 'transaction-actions-visible' : ''}`}>
            <button
              className="transaction-action-btn transaction-edit-btn"
              onClick={() => console.log('Edit', id)}
              title="Editar"
            >
              <IconEdit size={18} />
            </button>
            <button
              className="transaction-action-btn transaction-delete-btn"
              onClick={() => console.log('Delete', id)}
              title="Eliminar"
            >
              <IconTrash size={18} />
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}