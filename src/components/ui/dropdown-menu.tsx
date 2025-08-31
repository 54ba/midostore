"use client"

import * as React from "react"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
    children: React.ReactNode
}

interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    sideOffset?: number
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    inset?: boolean
}

interface DropdownMenuCheckboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    checked?: boolean
}

interface DropdownMenuRadioItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    inset?: boolean
}

interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> { }

interface DropdownMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
    return <div className="relative">{children}</div>
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
    ({ className, children, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
    ({ className, children, sideOffset = 4, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                className
            )}
            style={{ marginTop: sideOffset }}
            {...props}
        >
            {children}
        </div>
    )
)
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
    ({ className, inset, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                inset && "pl-8",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
)
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
    ({ className, children, checked, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {checked && <Check className="h-4 w-4" />}
            </span>
            {children}
        </div>
    )
)
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <Circle className="h-2 w-2 fill-current" />
            </span>
            {children}
        </div>
    )
)
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
    ({ className, inset, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "px-2 py-1.5 text-sm font-semibold",
                inset && "pl-8",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("-mx-1 my-1 h-px bg-muted", className)}
            {...props}
        />
    )
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuShortcut = ({ className, ...props }: DropdownMenuShortcutProps) => {
    return (
        <span
            className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
            {...props}
        />
    )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// Placeholder components for compatibility
const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuSubContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuSubTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuRadioGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
}