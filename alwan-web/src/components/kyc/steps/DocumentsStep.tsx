'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Upload, Check } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { toast } from 'sonner'

export default function DocumentsStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()
  const [utilityBillFile, setUtilityBillFile] = useState<File | null>(formData.utilityBillFile)
  const [businessPermitFile, setBusinessPermitFile] = useState<File | null>(formData.businessPermitFile)
  
  const utilityBillInputRef = useRef<HTMLInputElement>(null)
  const businessPermitInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File | null, type: 'utilityBill' | 'businessPermit') => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    const validTypes = ['image/', 'application/pdf']
    if (!validTypes.some(t => file.type.startsWith(t))) {
      toast.error('Please upload an image or PDF file')
      return
    }

    if (type === 'utilityBill') {
      setUtilityBillFile(file)
    } else {
      setBusinessPermitFile(file)
    }
  }

  const handleContinue = () => {
    if (!utilityBillFile) {
      toast.error('Please upload a utility bill or proof of billing')
      return
    }

    updateFormData({
      utilityBillFile,
      businessPermitFile,
    })
    markStepComplete(11)
    toast.success('Documents uploaded!')
    setCurrentStep(12)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        {/* Utility Bill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Utility Bill / Proof of Billing <span className="text-red-500">*</span>
          </label>
          <input
            ref={utilityBillInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'utilityBill')}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => utilityBillInputRef.current?.click()}
            className="w-full px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 ease-in-out flex flex-col items-center gap-2"
          >
            {utilityBillFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-500" />
                <span className="text-sm text-gray-900">{utilityBillFile.name}</span>
                <span className="text-xs text-gray-500">
                  {(utilityBillFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
                </span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-900">Upload Utility Bill</span>
                <span className="text-xs text-gray-500">
                  Electric, water, internet bill, or bank statement
                </span>
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-gray-500">
            Must show your name and address. Accepted formats: JPG, PNG, PDF (max 5MB)
          </p>
        </div>

        {/* Business Permit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Permit <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            ref={businessPermitInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'businessPermit')}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => businessPermitInputRef.current?.click()}
            className="w-full px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 ease-in-out flex flex-col items-center gap-2"
          >
            {businessPermitFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-500" />
                <span className="text-sm text-gray-900">{businessPermitFile.name}</span>
                <span className="text-xs text-gray-500">
                  {(businessPermitFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
                </span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-900">Upload Business Permit</span>
                <span className="text-xs text-gray-500">
                  DTI, Barangay Permit, or SEC Registration
                </span>
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-gray-500">
            If available. Helps strengthen your application.
          </p>
        </div>

        {/* Document Checklist */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Document Checklist:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${utilityBillFile ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                {utilityBillFile && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${utilityBillFile ? 'text-gray-900' : 'text-gray-500'}`}>
                Utility Bill / Proof of Billing
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${businessPermitFile ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                {businessPermitFile && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${businessPermitFile ? 'text-gray-900' : 'text-gray-500'}`}>
                Business Permit (Optional)
              </span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Document requirements:</strong> All documents must be clear, readable, and not expired. Ensure your name and address are visible on the utility bill.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-2">Tips for better approval:</p>
          <ul className="space-y-1 text-sm text-yellow-700">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Use good lighting when taking photos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Ensure all text is readable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Avoid blurry or cropped images</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Upload recent documents (within 3 months)</span>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(10)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 ease-in-out"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!utilityBillFile}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4dd88f] to-[#009245] hover:from-[#009245] hover:to-[#056633] text-white font-semibold rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
