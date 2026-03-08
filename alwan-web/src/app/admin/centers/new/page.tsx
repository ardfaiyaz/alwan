'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function NewCenterPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        meetingLocation: '',
        meetingDay: '',
        meetingTime: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // TODO: Implement Server Action to create center
        console.log('Creating center:', formData)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Redirect to centers list
        router.push('/admin/centers')
    }

    return (
        <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div>
                <Link href="/admin/centers">
                    <GlassyButton variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} className="mb-4">
                        Back to Centers
                    </GlassyButton>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Create New Center</h1>
                <p className="text-gray-500 mt-1">Set up a new trust banking center</p>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Center Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Center Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Center Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Barangay Commonwealth Center"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Center Code */}
                        <div className="space-y-2">
                            <Label htmlFor="code">Center Code *</Label>
                            <Input
                                id="code"
                                placeholder="e.g., BCC-001"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                            <p className="text-xs text-gray-500">Unique identifier for this center</p>
                        </div>

                        {/* Meeting Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Meeting Location *</Label>
                            <Input
                                id="location"
                                placeholder="e.g., Barangay Hall, Commonwealth Ave"
                                value={formData.meetingLocation}
                                onChange={(e) => setFormData({ ...formData, meetingLocation: e.target.value })}
                                required
                            />
                        </div>

                        {/* Meeting Schedule */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="day">Meeting Day *</Label>
                                <Select
                                    value={formData.meetingDay}
                                    onValueChange={(value) => setFormData({ ...formData, meetingDay: value })}
                                >
                                    <SelectTrigger id="day">
                                        <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DAYS_OF_WEEK.map((day) => (
                                            <SelectItem key={day} value={day}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time">Meeting Time *</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.meetingTime}
                                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <GlassyButton
                                type="submit"
                                isLoading={isSubmitting}
                                loadingText="Creating..."
                                className="flex-1"
                            >
                                Create Center
                            </GlassyButton>
                            <GlassyButton
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </GlassyButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
