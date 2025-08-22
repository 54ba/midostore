import React from 'react'
import DashboardLayoutFrame from '@/components/DashboardLayoutFrame'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayoutFrame>
            {children}
        </DashboardLayoutFrame>
    )
}