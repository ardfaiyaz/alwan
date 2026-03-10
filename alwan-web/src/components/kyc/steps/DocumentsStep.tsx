'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, ArrowRight, ArrowLeft, Upload, Check } from 'lucide-react'
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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Validate file type
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
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <FileText className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Document Upload
        </h3>
        <p className="text-white/70">
          Upload required documents for verification
        </p>
      </div>

      <div className="space-y-5">
        {/* Utility Bill */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Utility Bill / Proof of Billing <span className="text-red-400">*</span>
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
            className="w-full px-4 py-6 bg-white/5 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/10 transition-all flex flex-col items-center gap-2"
          >
            {utilityBillFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-400" />
                <span className="text-sm text-white">{utilityBillFile.name}</span>
                <span className="text-xs text-white/50">
                  {(utilityBillFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
                </span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-white/60" />
                <span className="text-sm text-white">Upload Utility Bill</span>
                <span className="text-xs text-white/50">
                  Electric, water, internet bill, or bank statement
                </span>
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-white/50">
            Must show your name and address. Accepted formats: JPG, PNG, PDF (max 5MB)
          </p>
        </div>

        {/* Business Permit */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Business Permit <span className="text-white/50">(Optional)</span>
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
            className="w-full px-4 py-6 bg-white/5 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/10 transition-all flex flex-col items-center gap-2"
          >
            {businessPermitFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-400" />
                <span className="text-sm text-white">{businessPermitFile.name}</span>
                <span className="text-xs text-white/50">
                  {(businessPermitFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
                </span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-white/60" />
                <span className="text-sm text-white">Upload Business Permit</span>
                <span className="text-xs text-white/50">
                  DTI, Barangay Permit, or SEC Registration
                </span>
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-white/50">
            If available. Helps strengthen your application.
          </p>
        </div>

        {/* Document Checklist */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm font-semibold text-white mb-3">Document Checklist:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${utilityBillFile ? 'bg-emerald-500' : 'bg-white/10'}`}>
                {utilityBillFile && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${utilityBillFile ? 'text-white' : 'text-white/60'}`}>
                Utility Bill / Proof of Billing
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${businessPermitFile ? 'bg-emerald-500' : 'bg-white/10'}`}>
                {businessPermitFile && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${businessPermitFile ? 'text-white' : 'text-white/60'}`}>
                Business Permit (Optional)
              </span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            <strong>Document requirements:</strong> All documents must be clear, readable, and not expired. Ensure your name and address are visible on the utility bill.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-yellow-200 mb-2">Tips for better approval:</p>
          <ul className="space-y-1 text-sm text-yellow-200/80">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">•</span>
              <span>Use good lighting when taking photos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">•</span>
              <span>Ensure all text is readable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">•</span>
              <span>Avoid blurry or cropped images</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">•</span>
              <span>Upload recent documents (within 3 months)</span>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(10)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!utilityBillFile}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
