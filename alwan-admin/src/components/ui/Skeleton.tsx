import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  borderRadius?: string
}

function Skeleton({
  className,
  width,
  height,
  borderRadius,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      style={{
        width,
        height,
        borderRadius,
      }}
      {...props}
    />
  )
}

export { Skeleton }
