'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { useLoanStore } from '@/stores/useLoanStore'
import { calculateLoan, generateRepaymentSchedule } from '@/lib/utils/loan-calculations'
import { formatCurrency } from '@/lib/utils/formatters'

const LOAN_TYPES = [
    { value: 'kabalikat', label: 'Kabalikat (Up to ₱50,000)' },
    { value: 'maunlad', label: 'Maunlad (Graduated members)' },
    { value: 'masagana', label: 'Masagana (Agricultural)' },
    { value: 'k_flex', label: 'K-Flex (Seasonal capital)' },
    { value: 'k_agapay', label: 'K-Agapay (Urgent events)' },
    { value: 'k_silong', label: 'K-Silong (Business facilities)' }
]

const STEPS = [
    { number: 1, title: 'Borrower Selection' },
    { number: 2, title: 'Loan Details' },
    { number: 3, title: 'Business Evaluation' },
    { number: 4, title: 'Review & Submit' }
]

export default function NewLoanPage() {
    const router = useRouter()
    const { formData, currentStep, setFormData, setCurrentStep, nextStep, previousStep, resetForm } = useLoanStore()
    const [calculation, setCalculation] = useState<ReturnType<typeof calculateLoan> | null>(null)

    // Calculate loan amounts when principal or term changes
    useEffect(() => {
        if (formData.principalAmount && formData.termWeeks) {
            const calc = calculateLoan(formData.principalAmount, 2.0, formData.termWeeks)
            setCalculation(calc)
            setFormData({
                totalInterest: calc.totalInterest,
                cbuAmount: calc.cbuAmount,
                totalAmount: calc.totalAmount,
                weeklyPayment: calc.weeklyPayment
            })
        }
    }, [formData.principalAmount, formData.termWeeks])

    const handleSubmit = async () => {
        // TODO: Implement Server Action to create loan
        console.log('Creating loan:', formData)

        // Reset form and redirect
        resetForm()
        router.push('/admin/loans')
    }

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div>
                <Link href="/admin/loans">
                    <GlassyButton variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} className="mb-4">
                        Back to Loans
                    </GlassyButton>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">New Loan Application</h1>
                <p className="text-gray-500 mt-1">Complete the 4-step process to create a loan application</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep > step.number
                                    ? 'bg-[var(--kmbi-green)] text-white'
                                    : currentStep === step.number
                                        ? 'bg-[var(--kmbi-green)] text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                            </div>
                            <p className={`text-xs mt-2 text-center ${currentStep === step.number ? 'font-semibold' : ''}`}>
                                {step.title}
                            </p>
                        </div>
                        {index < STEPS.length - 1 && (
                            <div className={`h-1 flex-1 mx-2 ${currentStep > step.number ? 'bg-[var(--kmbi-green)]' : 'bg-gray-200'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <Card>
                <CardHeader>
                    <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Step 1: Borrower Selection */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="center">Select Center *</Label>
                                <Select
                                    value={formData.centerId}
                                    onValueChange={(value) => setFormData({ centerId: value })}
                                >
                                    <SelectTrigger id="center">
                                        <SelectValue placeholder="Choose a center" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Barangay Commonwealth Center</SelectItem>
                                        <SelectItem value="2">Fairview Heights Center</SelectItem>
                                        <SelectItem value="3">Batasan Hills Center</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="member">Select Member *</Label>
                                <Select
                                    value={formData.memberId}
                                    onValueChange={(value) => setFormData({ memberId: value })}
                                    disabled={!formData.centerId}
                                >
                                    <SelectTrigger id="member">
                                        <SelectValue placeholder="Choose a member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Maria Santos</SelectItem>
                                        <SelectItem value="2">Ana Reyes</SelectItem>
                                        <SelectItem value="3">Rosa Cruz</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.memberId && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm font-medium text-blue-900">Member Information</p>
                                    <p className="text-sm text-blue-700 mt-1">No active loans • Good standing</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Loan Details */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="loanType">Loan Type *</Label>
                                <Select
                                    value={formData.loanType}
                                    onValueChange={(value: any) => setFormData({ loanType: value })}
                                >
                                    <SelectTrigger id="loanType">
                                        <SelectValue placeholder="Choose loan type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOAN_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="principal">Principal Amount (₱) *</Label>
                                    <Input
                                        id="principal"
                                        type="number"
                                        placeholder="e.g., 30000"
                                        value={formData.principalAmount || ''}
                                        onChange={(e) => setFormData({ principalAmount: parseFloat(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="term">Term (Weeks) *</Label>
                                    <Input
                                        id="term"
                                        type="number"
                                        placeholder="e.g., 52"
                                        value={formData.termWeeks || ''}
                                        onChange={(e) => setFormData({ termWeeks: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="purpose">Purpose of Loan *</Label>
                                <Textarea
                                    id="purpose"
                                    placeholder="Describe how the loan will be used..."
                                    value={formData.purpose || ''}
                                    onChange={(e) => setFormData({ purpose: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            {calculation && (
                                <div className="p-6 bg-gray-50 rounded-lg space-y-3">
                                    <h3 className="font-semibold text-gray-900">Loan Calculation</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Interest (2% monthly)</p>
                                            <p className="font-semibold">{formatCurrency(calculation.totalInterest)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">CBU (5%)</p>
                                            <p className="font-semibold">{formatCurrency(calculation.cbuAmount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="font-semibold text-lg" style={{ color: 'var(--kmbi-green)' }}>
                                                {formatCurrency(calculation.totalAmount)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Weekly Payment</p>
                                            <p className="font-semibold text-lg" style={{ color: 'var(--kmbi-green)' }}>
                                                {formatCurrency(calculation.weeklyPayment)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Business Evaluation */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600">
                                Upload site visit photos and provide evaluation scores (1-10 scale)
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="viability">Business Viability Score *</Label>
                                    <Input
                                        id="viability"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.businessViabilityScore || ''}
                                        onChange={(e) => setFormData({ businessViabilityScore: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Repayment Capacity Score *</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.repaymentCapacityScore || ''}
                                        onChange={(e) => setFormData({ repaymentCapacityScore: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="character">Character Score *</Label>
                                    <Input
                                        id="character"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.characterScore || ''}
                                        onChange={(e) => setFormData({ characterScore: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="overall">Overall Score *</Label>
                                    <Input
                                        id="overall"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.overallScore || ''}
                                        onChange={(e) => setFormData({ overallScore: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Evaluation Notes</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Additional observations..."
                                        value={formData.evaluationNotes || ''}
                                        onChange={(e) => setFormData({ evaluationNotes: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="risk">Risk Assessment</Label>
                                    <Textarea
                                        id="risk"
                                        placeholder="Risk factors and mitigation..."
                                        value={formData.riskAssessment || ''}
                                        onChange={(e) => setFormData({ riskAssessment: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review & Submit */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="p-6 bg-gray-50 rounded-lg space-y-4">
                                <h3 className="font-semibold text-gray-900">Loan Summary</h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Loan Type</p>
                                        <p className="font-medium">{formData.loanType?.toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Principal Amount</p>
                                        <p className="font-medium">{formatCurrency(formData.principalAmount || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Term</p>
                                        <p className="font-medium">{formData.termWeeks} weeks</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Weekly Payment</p>
                                        <p className="font-medium">{formatCurrency(formData.weeklyPayment || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Overall Score</p>
                                        <p className="font-medium">{formData.overallScore}/10</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-900">
                                    By submitting this application, it will be sent to the Branch Manager for approval.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                        {currentStep > 1 && (
                            <GlassyButton variant="outline" onClick={previousStep} icon={<ArrowLeft className="h-4 w-4" />}>
                                Previous
                            </GlassyButton>
                        )}

                        <div className="flex-1" />

                        {currentStep < 4 ? (
                            <GlassyButton onClick={nextStep}>
                                Next
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </GlassyButton>
                        ) : (
                            <GlassyButton onClick={handleSubmit}>
                                Submit Application
                            </GlassyButton>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
