'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GlassyButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    loadingText?: string
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    icon?: React.ReactNode
}

const GlassyButton = React.forwardRef<HTMLButtonElement, GlassyButtonProps>(
    (
        {
            className,
            children,
            isLoading = false,
            loadingText,
            variant = 'default',
            size = 'md',
            icon,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = cn(
            'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009245] focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            'relative overflow-hidden group'
        )

        const variantStyles = {
            default: cn(
                'bg-gradient-to-br from-[#009245]/90 to-[#007a3d]/90 text-white',
                'backdrop-blur-xl border border-white/20',
                'shadow-lg shadow-[#009245]/25',
                'hover:shadow-xl hover:shadow-[#009245]/35 hover:scale-[1.02]',
                'active:scale-[0.98]',
                // Shimmer effect
                'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
                'before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700'
            ),
            outline: cn(
                'bg-white/10 text-[#009245] backdrop-blur-xl',
                'border-2 border-[#009245]/30',
                'hover:bg-[#009245]/10 hover:border-[#009245]/50',
                'shadow-md shadow-[#009245]/10'
            ),
            ghost: cn(
                'bg-transparent text-[#009245]',
                'hover:bg-[#009245]/10',
                'border border-transparent hover:border-[#009245]/20'
            ),
        }

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2.5 text-base',
            lg: 'px-6 py-3 text-lg',
        }

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{loadingText || 'Loading...'}</span>
                    </>
                ) : (
                    <>
                        {icon && <span className="shrink-0">{icon}</span>}
                        {children}
                    </>
                )}
            </button>
        )
    }
)

GlassyButton.displayName = 'GlassyButton'

export { GlassyButton }
