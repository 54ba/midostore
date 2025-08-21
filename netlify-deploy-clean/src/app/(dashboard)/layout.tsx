import React from 'react'
import DashboardLayoutFrame from '@/components/DashboardLayoutFrame'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutFrame>
      {children}
    </DashboardLayoutFrame>
  )
}