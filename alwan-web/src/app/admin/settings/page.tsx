'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Settings, Save, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface GlobalSetting {
    id: string
    key: string
    value: any
    description: string
    updatedAt: string
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<GlobalSetting[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        setIsLoading(true)
        try {
            // TODO: Replace with actual API call
            const mockSettings: GlobalSetting[] = [
                {
                    id: '1',
                    key: 'interest_rate',
                    value: 2.0,
                    description: 'Default monthly interest rate (%)',
                    updatedAt: '2024-01-15T08:00:00Z',
                },
                {
                    id: '2',
                    key: 'cbu_percentage',
                    value: 5.0,
                    description: 'Capital Build-Up percentage of principal (%)',
                    updatedAt: '2024-01-15T08:00:00Z',
                },
                {
                    id: '3',
                    key: 'default_loan_term_weeks',
                    value: 52,
                    description: 'Default loan term in weeks',
                    updatedAt: '2024-01-15T08:00:00Z',
                },
                {
                    id: '4',
                    key: 'max_loan_amount_kabalikat',
                    value: 50000,
                    description: 'Maximum loan amount for Kabalikat (₱)',
                    updatedAt: '2024-01-15T08:00:00Z',
                },
                {
                    id: '5',
                    key: 'approval_threshold_area',
                    value: 20000,
                    description: 'Loans above this amount require Area Manager approval (₱)',
                    updatedAt: '2024-01-15T08:00:00Z',
                },
                {
                    id: '6',
                    key: 'microinsurance_weekly_premium',
                    value: 10.0,
                    description: 'Default weekly K-Kalinga premium (₱)',
                    updatedAt: '2024-01-15T08:00:00Z',
                },
                {
                    id: '7',
                    key: 'microinsurance_coverage',
                    value: 50000.0,
                    description: 'Default K-Kalinga coverage amount (₱)',
                    updatedAt: '2024-01-15T08:00:00Z',
                },
            ]
            setSettings(mockSettings)
        } catch (error) {
            toast.error('Failed to load settings')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateSetting = (key: string, value: any) => {
        setSettings(settings.map(s => s.key === key ? { ...s, value } : s))
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        try {
            // TODO: API call to save settings
            await new Promise(resolve => setTimeout(resolve, 1500))
            toast.success('Settings saved successfully')
        } catch (error) {
            toast.error('Failed to save settings')
        } finally {
            setIsSaving(false)
        }
    }

    const settingCategories = [
        {
            title: 'Loan Configuration',
            icon: '💰',
            keys: ['interest_rate', 'cbu_percentage', 'default_loan_term_weeks', 'max_loan_amount_kabalikat'],
        },
        {
            title: 'Approval Workflow',
            icon: '✅',
            keys: ['approval_threshold_area'],
        },
        {
            title: 'Microinsurance (K-Kalinga)',
            icon: '🛡️',
            keys: ['microinsurance_weekly_premium', 'microinsurance_coverage'],
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
                    <p className="text-gray-500 mt-1">Configure system-wide parameters</p>
                </div>
                <div className="flex gap-3">
                    <GlassyButton variant="outline" onClick={loadSettings} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </GlassyButton>
                    <GlassyButton
                        onClick={handleSaveSettings}
                        isLoading={isSaving}
                        loadingText="Saving..."
                        className="gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </GlassyButton>
                </div>
            </div>

            {/* Settings Categories */}
            {settingCategories.map((category) => (
                <Card key={category.title}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">{category.icon}</span>
                            {category.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {settings
                                .filter(s => category.keys.includes(s.key))
                                .map((setting) => (
                                    <div key={setting.key} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2">
                                                <Label htmlFor={setting.key} className="text-base font-semibold">
                                                    {setting.key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                </Label>
                                                <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                                            </div>
                                            <div>
                                                <Input
                                                    id={setting.key}
                                                    type="number"
                                                    step="0.01"
                                                    value={setting.value}
                                                    onChange={(e) => handleUpdateSetting(setting.key, parseFloat(e.target.value))}
                                                    className="text-right font-semibold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Warning Notice */}
            <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                            <h3 className="font-semibold text-orange-900">Important Notice</h3>
                            <p className="text-sm text-orange-800 mt-1">
                                Changes to these settings will affect all new loans and transactions. Existing loans will not be affected.
                                Please ensure you have proper authorization before making changes.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
