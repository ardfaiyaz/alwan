'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { ArrowLeft, User, Phone, MapPin, Briefcase, Calendar, TrendingUp, DollarSign, Wallet } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/formatters'

interface Member {
    id: string
    firstName: string
    lastName: string
    middleName?: string
    dateOfBirth: string
    gender: string
    phone?: string
    address: string
    businessName?: string
    businessType?: string
    businessAddress?: string
    cbuBalance: number
    joinedDate: string
    isActive: boolean
    center: {
        id: string
        name: string
        code: string
    }
}

interface Loan {
    id: string
    loanType: string
    principalAmount: number
    outstandingBalance: number
    status: string
    disbursementDate: string
    weeklyPayment: number
}

export default function MemberProfilePage() {
    const params = useParams()
    const memberId = params.id as string

    const [member, setMember] = useState<Member | null>(null)
    const [loans, setLoans] = useState<Loan[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadMemberData()
    }, [memberId])

    const loadMemberData = async () => {
        setIsLoading(true)
        try {
            // TODO: Replace with actual API calls
            const mockMember: Member = {
                id: memberId,
                firstName: 'Maria',
                lastName: 'Santos',
                middleName: 'Garcia',
                dateOfBirth: '1985-05-15',
                gender: 'female',
                phone: '+63 912 345 6789',
                address: '123 Main St, Barangay Commonwealth, Quezon City',
                businessName: 'Maria\'s Sari-Sari Store',
                businessType: 'Retail',
                businessAddress: '123 Main St, Barangay Commonwealth, Quezon City',
                cbuBalance: 5250.00,
                joinedDate: '2023-01-15',
                isActive: true,
                center: {
                    id: 'center-1',
                    name: 'Barangay Commonwealth Center',
                    code: 'BC-001',
                },
            }

            const mockLoans: Loan[] = [
                {
                    id: 'loan-1',
                    loanType: 'kabalikat',
                    principalAmount: 25000,
                    outstandingBalance: 18500,
                    status: 'active',
                    disbursementDate: '2024-01-10',
                    weeklyPayment: 625,
                },
                {
                    id: 'loan-2',
                    loanType: 'kabalikat',
                    principalAmount: 20000,
                    outstandingBalance: 0,
                    status: 'completed',
                    disbursementDate: '2023-06-15',
                    weeklyPayment: 500,
                },
            ]

            setMember(mockMember)
            setLoans(mockLoans)
        } catch (error) {
            console.error('Failed to load member data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading || !member) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading member profile...</p>
                </div>
            </div>
        )
    }

    const fullName = `${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`
    const age = new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()
    const totalBorrowed = loans.reduce((sum, loan) => sum + loan.principalAmount, 0)
    const totalOutstanding = loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0)
    const activeLoan = loans.find(l => l.status === 'active')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/members">
                        <GlassyButton variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </GlassyButton>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                        <p className="text-gray-500 mt-1">Member Profile - Member 360 View</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <GlassyButton variant="outline">Edit Profile</GlassyButton>
                    <GlassyButton>New Loan</GlassyButton>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Wallet className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">CBU Balance</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(member.cbuBalance)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Borrowed</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalBorrowed)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Outstanding</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Member Since</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {new Date(member.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">Full Name</p>
                            <p className="font-semibold">{fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Date of Birth</p>
                            <p className="font-semibold">
                                {new Date(member.dateOfBirth).toLocaleDateString()} ({age} years old)
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Gender</p>
                            <p className="font-semibold capitalize">{member.gender}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-semibold">{member.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Address</p>
                                <p className="font-semibold">{member.address}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Center</p>
                            <p className="font-semibold">{member.center.name}</p>
                            <p className="text-xs text-gray-500">{member.center.code}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Business Information & Loan History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Business Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Business Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Business Name</p>
                                <p className="font-semibold">{member.businessName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Business Type</p>
                                <p className="font-semibold">{member.businessType || 'N/A'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-600">Business Address</p>
                                <p className="font-semibold">{member.businessAddress || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loan History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Loan History ({loans.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loans.map((loan) => (
                                    <div
                                        key={loan.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-semibold capitalize">{loan.loanType.replace('_', ' ')}</p>
                                                <p className="text-sm text-gray-500">
                                                    Disbursed: {new Date(loan.disbursementDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${loan.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    loan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {loan.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Principal</p>
                                                <p className="font-semibold">{formatCurrency(loan.principalAmount)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Outstanding</p>
                                                <p className="font-semibold">{formatCurrency(loan.outstandingBalance)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Weekly Payment</p>
                                                <p className="font-semibold">{formatCurrency(loan.weeklyPayment)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
