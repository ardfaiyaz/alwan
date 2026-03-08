"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps {
    checked?: boolean | "indeterminate"
    onCheckedChange?: (checked: boolean) => void
    className?: string
    disabled?: boolean
}

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
    ({ checked, onCheckedChange, className, disabled, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="checkbox"
                aria-checked={checked === true}
                data-state={checked ? "checked" : "unchecked"}
                className={cn(
                    "peer h-4 w-4 shrink-0 rounded-sm border border-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=checked]:text-black flex items-center justify-center cursor-pointer",
                    checked ? "bg-gray-900 text-white" : "bg-white text-gray-900",
                    className
                )}
                onClick={() => {
                    if (!disabled && onCheckedChange) {
                        onCheckedChange(!checked)
                    }
                }}
                {...props}
            >
                {checked && (
                    <Check className="h-3 w-3 stroke-[3]" />
                )}
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
