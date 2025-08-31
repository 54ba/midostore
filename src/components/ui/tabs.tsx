"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    value: string
    children: React.ReactNode
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
    children: React.ReactNode
}

const Tabs = ({ defaultValue, value, onValueChange, children }: TabsProps) => {
    const [activeTab, setActiveTab] = React.useState(value || defaultValue || "")

    const handleValueChange = (newValue: string) => {
        setActiveTab(newValue)
        onValueChange?.(newValue)
    }

    return (
        <div className="w-full">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        activeTab,
                        onValueChange: handleValueChange
                    } as any)
                }
                return child
            })}
        </div>
    )
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, children, activeTab, onValueChange, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                activeTab === value
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-background/50",
                className
            )}
            onClick={() => onValueChange?.(value)}
            {...props}
        >
            {children}
        </button>
    )
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, children, activeTab, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                activeTab === value ? "block" : "hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }