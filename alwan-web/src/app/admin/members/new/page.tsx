'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, User, Phone, MapPin, Briefcase, Heart, Calendar, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { createMember, getCenters } from '@/app/actions/members'

export default function NewMemberPage() {
    const router = useRouter()
    const [centers, setCenters] = useState<{ id: string; name: string }[]>([])
    const [isLoadingCenters, setIsLoadingCenters] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [form, setForm] = useState({
        centerId: '',
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        gender: 'female' as 'male' | 'female' | 'other',
        phone: '',
        address: '',
        businessName: '',
        businessType: '',
        businessAddress: '',
        spouseName: '',
        beneficiaryName: '',
        beneficiaryRelationship: '',
        beneficiaryPhone: '',
    })

    useEffect(() => {
        const loadCenters = async () => {
            try {
                const data = await getCenters()
                setCenters(data)
            } finally {
                setIsLoadingCenters(false)
            }
        }
        loadCenters()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.centerId) {
            toast.error('Please select a center')
            return
        }
        setIsSaving(true)
        try {
            await createMember(form)
            toast.success('Member registered successfully')
            router.push('/admin/users') // Redirect back to member list
        } catch (error: any) {
            toast.error(error.message || 'Failed to register member')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <GlassyButton variant="ghost" className="p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </GlassyButton>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Register New Member</h1>
                    <p className="text-gray-500">Add a new borrower to the system</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Center Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Assignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="centerId">Center</Label>
                                <Select value={form.centerId} onValueChange={(v) => setForm({ ...form, centerId: v })}>
                                    <SelectTrigger id="centerId">
                                        <SelectValue placeholder={isLoadingCenters ? "Loading centers..." : "Select Center"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {centers.map(center => (
                                            <SelectItem key={center.id} value={center.id}>{center.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-green-600" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="middleName">Middle Name</Label>
                                <Input id="middleName" value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={form.gender} onValueChange={(v: any) => setForm({ ...form, gender: v })}>
                                    <SelectTrigger id="gender">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+63 XXX XXX XXXX" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Full Address</Label>
                            <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                        </div>
                    </CardContent>
                </Card>

                {/* Business Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                            Business Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input id="businessName" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessType">Business Type (e.g. Sari-sari, Tailoring)</Label>
                                <Input id="businessType" value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="businessAddress">Business Address</Label>
                            <Input id="businessAddress" value={form.businessAddress} onChange={(e) => setForm({ ...form, businessAddress: e.target.value })} />
                        </div>
                    </CardContent>
                </Card>

                {/* Family & Beneficiary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-600" />
                            Family & Beneficiary (K-Kalinga)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="spouseName">Spouse Full Name (if applicable)</Label>
                            <Input id="spouseName" value={form.spouseName} onChange={(e) => setForm({ ...form, spouseName: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                                <Input id="beneficiaryName" value={form.beneficiaryName} onChange={(e) => setForm({ ...form, beneficiaryName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="beneficiaryRelationship">Relationship</Label>
                                <Input id="beneficiaryRelationship" value={form.beneficiaryRelationship} onChange={(e) => setForm({ ...form, beneficiaryRelationship: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="beneficiaryPhone">Beneficiary Phone</Label>
                                <Input id="beneficiaryPhone" value={form.beneficiaryPhone} onChange={(e) => setForm({ ...form, beneficiaryPhone: e.target.value })} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/admin/users">
                        <GlassyButton type="button" variant="outline" disabled={isSaving}>Cancel</GlassyButton>
                    </Link>
                    <GlassyButton type="submit" isLoading={isSaving} disabled={isSaving} className="px-8">
                        Register Member
                    </GlassyButton>
                </div>
            </form>
        </div>
    )
}
