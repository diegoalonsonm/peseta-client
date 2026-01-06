'use client'

import Link from 'next/link'
import { IconChevronRight } from '@tabler/icons-react'

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li
              key={index}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast || !item.href ? (
                <span>{item.label}</span>
              ) : (
                <>
                  <Link href={item.href}>{item.label}</Link>
                  <IconChevronRight size={16} className="breadcrumb-separator" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
