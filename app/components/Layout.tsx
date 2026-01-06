'use client'

import { LayoutProps } from '@/types'
import React, { useEffect } from 'react'
import { Navbar } from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { usePathname } from 'next/navigation'


function Layout({ lang, children, className }: LayoutProps) {
  const pathname = usePathname()
  const hiddenPaths = ['/login', '/register', '/resetPassword']

  useEffect(() => {
    if(typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.min.js')
    }
  }, [])

  const showNavigation = !hiddenPaths.includes(pathname)

  return (
    <html lang={lang}>
      <body className={className}>
        {showNavigation && (
          <>
            {/* Mobile/Tablet: Simple top navbar */}
            <div className="mobile-navbar-wrapper">
              <Navbar />
            </div>
            {/* Desktop: Sidebar */}
            <div className="desktop-sidebar-wrapper">
              <Sidebar />
            </div>
          </>
        )}
        <div className={showNavigation ? 'main-content' : ''}>
          {children}
        </div>
        {showNavigation && <BottomNav />}
      </body>
    </html>
  )
}

export default Layout