import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface DashboardStats {
    totalMembers: number
    activeLoans: number
    totalPortfolio: number
    collectionRate: number
    parRate: number
    weeklyTarget: number
    weeklyCollected: number
}

interface DashboardStore {
    stats: DashboardStats | null
    isLoading: boolean
    lastUpdated: Date | null

    // Actions
    setStats: (stats: DashboardStats) => void
    setLoading: (loading: boolean) => void
    refreshStats: () => Promise<void>
}

export const useDashboardStore = create<DashboardStore>()(
    devtools(
        persist(
            (set, get) => ({
                stats: null,
                isLoading: false,
                lastUpdated: null,

                setStats: (stats) => set({ stats, lastUpdated: new Date() }),

                setLoading: (loading) => set({ isLoading: loading }),

                refreshStats: async () => {
                    set({ isLoading: true })
                    try {
                        // TODO: Replace with actual API call
                        const mockStats: DashboardStats = {
                            totalMembers: 1250,
                            activeLoans: 890,
                            totalPortfolio: 45250000,
                            collectionRate: 96.5,
                            parRate: 2.3,
                            weeklyTarget: 1500000,
                            weeklyCollected: 1447500,
                        }

                        await new Promise(resolve => setTimeout(resolve, 1000))
                        set({ stats: mockStats, lastUpdated: new Date(), isLoading: false })
                    } catch (error) {
                        console.error('Failed to refresh stats:', error)
                        set({ isLoading: false })
                    }
                },
            }),
            {
                name: 'dashboard-storage',
                partialize: (state) => ({ stats: state.stats, lastUpdated: state.lastUpdated }),
            }
        )
    )
)
