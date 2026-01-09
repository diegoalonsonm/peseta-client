'use client'

import { useRouter } from 'next/navigation'
import { IconArrowLeft } from '@tabler/icons-react'

type BackButtonProps = {
  text?: string
  href?: string
}

export default function BackButton({ text = 'Volver', href }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="back-button"
      aria-label={text}
    >
      <IconArrowLeft size={20} />
      <span>{text}</span>
    </button>
  )
}
