import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/Skeleton'

export function StatsCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-8 w-16 mx-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
