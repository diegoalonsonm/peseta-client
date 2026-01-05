'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { IconRefresh } from '@tabler/icons-react'

type PullToRefreshProps = {
  onRefresh: () => Promise<void>
  children: ReactNode
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: TouchEvent) => {
    // Only allow pull to refresh when scrolled to top
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    // Only pull down, not up
    if (distance > 0 && window.scrollY === 0) {
      // Add resistance to the pull
      const resistedDistance = Math.min(distance * 0.5, 100)
      setPullDistance(resistedDistance)
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling || isRefreshing) return

    setIsPulling(false)

    // Trigger refresh if pulled far enough
    if (pullDistance > 60) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh error:', error)
      } finally {
        setTimeout(() => {
          setIsRefreshing(false)
          setPullDistance(0)
        }, 500)
      }
    } else {
      setPullDistance(0)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, pullDistance, isRefreshing])

  return (
    <div ref={containerRef} className="pull-to-refresh-container">
      <div
        className={`pull-to-refresh-indicator ${isPulling && pullDistance > 30 ? 'pulling' : ''} ${isRefreshing ? 'refreshing' : ''}`}
        style={{
          opacity: pullDistance > 0 ? Math.min(pullDistance / 60, 1) : 0
        }}
      >
        <div className={isRefreshing ? 'pull-refresh-icon' : ''}>
          <IconRefresh
            size={28}
            style={{
              transform: isRefreshing ? 'none' : `rotate(${pullDistance * 3.6}deg)`,
              transition: isRefreshing ? 'none' : 'transform 0.1s ease-out'
            }}
          />
        </div>
        <span className="pull-refresh-text">
          {isRefreshing ? 'Actualizando...' : pullDistance > 60 ? 'Suelta para actualizar' : 'Desliza para actualizar'}
        </span>
      </div>
      {children}
    </div>
  )
}
