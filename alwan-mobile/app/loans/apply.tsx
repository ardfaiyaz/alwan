import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

type Member = {
    id: string;
    full_name: string;
    role: string;
};

type LoanProduct = {
    id: string;
    name: string;
    interest_rate_weekly: number;
    max_term_weeks: number;
};

// Local base64 decoder to avoid dependency issues
function decodeBase64(base64: string): Uint8Array {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;

    const clean = base64.replace(/[^A-Za-z0-9+/]/g, '');
    const len = clean.length;
    const byteLen = (len * 3) >> 2;
    const bytes = new Uint8Array(byteLen);
    let p = 0;
    for (let i = 0; i < len; i += 4) {
        const e1 = lookup[clean.charCodeAt(i)];
        const e2 = lookup[clean.charCodeAt(i + 1)];
        const e3 = lookup[clean.charCodeAt(i + 2)];
        const e4 = lookup[clean.charCodeAt(i + 3)];
        bytes[p++] = (e1 << 2) | (e2 >> 4);
        if (i + 2 < len) bytes[p++] = ((e2 & 15) << 4) | (e3 >> 2);
        if (i + 3 < len) bytes[p++] = ((e3 & 3) << 6) | e4;
    }
    return bytes;
}

export default function LoanApplicationScreen() {
    const router = useRouter();
    const { user, profile } = useAuth();
    const [step, setStep] = useState(1);
    const [loanAmount, setLoanAmount] = useState(5000);
    const [loanTerm, setLoanTerm] = useState(12); // weeks based
    const [selectedCoMakers, setSelectedCoMakers] = useState<string[]>([]);
    const [showSchedule, setShowSchedule] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [members, setMembers] = useState<Member[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

    // Document upload state
    const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
    const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});

    // Dynamic Constants based on Profile
    const CBU_BALANCE = profile?.cbu_balance || 0;
    const MAX_LOANABLE = Math.max(CBU_BALANCE * 2, 5000);
    const WEEKLY_INTEREST_RATE = selectedProduct?.interest_rate_weekly || 0.005;

    useEffect(() => {
        fetchInitialData();
    }, [user, profile]);

    const fetchInitialData = async () => {
        if (!user) return;

        try {
            // 1. Fetch Loan Products
            const { data: products } = await supabase
                .from('loan_products')
                .select('*')
                .limit(1);

            if (products && products.length > 0) {
                setLoanProducts(products);
                setSelectedProduct(products[0]);
            }

            // 2. USE MOCK MEMBERS for testing (per user request)
            const mockMembers: Member[] = [
                { id: 'mock-1', full_name: 'Maria Santos', role: 'member' },
                { id: 'mock-2', full_name: 'Juana Dela Cruz', role: 'member' },
                { id: 'mock-3', full_name: 'Elena Reyes', role: 'officer' },
                { id: 'mock-4', full_name: 'Ricardo Gomez', role: 'member' },
                { id: 'mock-5', full_name: 'Sonia Bautista', role: 'member' },
            ];
            setMembers(mockMembers);

            /* 
            // Skipping DB fetch for now
            setIsLoadingMembers(true);
            const { data: centerMembers } = await supabase
                .from('profiles')
                .select('id, full_name, role')
                .neq('id', user.id)
                .eq('center_id', profile?.center_id)
                .limit(20);
            
            if (centerMembers) {
                setMembers(centerMembers);
            }
            */
        } catch (error) {
            console.error('Error fetching initial application data:', error);
        } finally {
            setIsLoadingMembers(false);
        }
    };

    // Upload file to Supabase Storage
    const uploadFile = async (uri: string, name: string, type: string): Promise<string> => {
        try {
            const filePath = `${user?.id}/${Date.now()}_${name}`;
            let uploadData: Uint8Array | Blob;

            if (Platform.OS === 'web') {
                const response = await fetch(uri);
                const blob = await response.blob();
                uploadData = blob as any;
            } else {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                uploadData = decodeBase64(base64);
            }

            const { data, error } = await supabase.storage
                .from('loan-documents')
                .upload(filePath, uploadData, { contentType: type });

            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('loan-documents').getPublicUrl(data.path);
            return publicUrl;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    // Step 1: Eligibility Check
    const EligibilityStep = () => (
        <View>
            <View className="bg-emerald-50 p-6 rounded-2xl items-center mb-6">
                <Text className="text-gray-500 font-bold uppercase tracking-wider text-xs">Your CBU Balance</Text>
                <Text className="text-[#047857] text-4xl font-bold mt-2">P {CBU_BALANCE.toLocaleString()}</Text>
                <Text className="text-gray-400 text-xs mt-2">Max Loanable: P {MAX_LOANABLE.toLocaleString()}</Text>
            </View>

            <View className="bg-white border border-gray-100 p-4 rounded-xl mb-4">
                <View className="flex-row items-center mb-2">
                    <Ionicons name="checkmark-circle" size={20} color="#047857" />
                    <Text className="text-gray-700 font-bold ml-2">Active Member ({profile?.centers?.name || 'KMBI Center'})</Text>
                </View>
                <View className="flex-row items-center mb-2">
                    <Ionicons name="checkmark-circle" size={20} color="#047857" />
                    <Text className="text-gray-700 font-bold ml-2">No Past Due Payments</Text>
                </View>
                <View className="flex-row items-center">
                    {MAX_LOANABLE >= 5000 ? (
                        <Ionicons name="checkmark-circle" size={20} color="#047857" />
                    ) : (
                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                    )}
                    <Text className={`font-bold ml-2 ${MAX_LOANABLE >= 5000 ? 'text-gray-700' : 'text-red-500'}`}>
                        Sufficient CBU (Min P2,500)
                    </Text>
                </View>
            </View>
        </View>
    );

    // Step 2: Loan Calculator & Schedule
    const CalculatorStep = () => {
        const interest = loanAmount * WEEKLY_INTEREST_RATE * loanTerm;
        const totalDue = loanAmount + interest;
        const weeklyPayment = totalDue / loanTerm;

        return (
            <View>
                <Text className="text-gray-800 text-lg font-bold mb-4">Loan Details</Text>

                <View className="bg-white border border-gray-200 p-5 rounded-2xl mb-6 shadow-sm">
                    <Text className="text-gray-500 font-bold text-xs uppercase mb-2">Amount Needed</Text>
                    <View className="flex-row items-center justify-between mb-4">
                        <TouchableOpacity
                            className="p-2 bg-gray-100 rounded-lg"
                            onPress={() => setLoanAmount(Math.max(1000, loanAmount - 500))}
                        >
                            <Ionicons name="remove" size={24} color="#374151" />
                        </TouchableOpacity>
                        <Text className="text-3xl font-bold text-[#047857]">P {loanAmount.toLocaleString()}</Text>
                        <TouchableOpacity
                            className="p-2 bg-gray-100 rounded-lg"
                            onPress={() => setLoanAmount(Math.min(MAX_LOANABLE, loanAmount + 500))}
                        >
                            <Ionicons name="add" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-center text-gray-400 text-xs">Max: P {MAX_LOANABLE.toLocaleString()}</Text>

                    <View className="h-px bg-gray-100 my-4" />

                    <Text className="text-gray-500 font-bold text-xs uppercase mb-2">Loan Term (Maximum {selectedProduct?.max_term_weeks || 25} weeks)</Text>
                    <View className="flex-row items-center justify-between mb-2">
                        <TouchableOpacity
                            className="p-2 bg-gray-100 rounded-lg"
                            onPress={() => setLoanTerm(Math.max(12, loanTerm - 1))}
                        >
                            <Ionicons name="remove" size={24} color="#374151" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-gray-800">{loanTerm} Weeks</Text>
                        <TouchableOpacity
                            className="p-2 bg-gray-100 rounded-lg"
                            onPress={() => setLoanTerm(Math.min(selectedProduct?.max_term_weeks || 25, loanTerm + 1))}
                        >
                            <Ionicons name="add" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Schedule Preview */}
                <View className="bg-[#047857]/5 p-5 rounded-2xl border border-[#047857]/20">
                    <Text className="text-[#047857] font-bold text-sm uppercase mb-3">Payment Schedule Preview</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Weekly Amortization</Text>
                        <Text className="text-gray-900 font-bold">P {weeklyPayment.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">First Payment</Text>
                        <Text className="text-gray-900 font-bold">Next Tuesday Meeting</Text>
                    </View>
                    <TouchableOpacity
                        className="mt-2 py-2 items-center"
                        onPress={() => setShowSchedule(true)}
                    >
                        <Text className="text-[#047857] font-bold text-xs underline">View Full Schedule</Text>
                    </TouchableOpacity>
                </View>

                {/* Full Schedule Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSchedule}
                    onRequestClose={() => setShowSchedule(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <View className="bg-white rounded-t-3xl p-6 h-3/4">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-xl font-bold text-gray-800">Payment Schedule</Text>
                                <TouchableOpacity onPress={() => setShowSchedule(false)}>
                                    <Ionicons name="close" size={24} color="#374151" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {Array.from({ length: loanTerm }).map((_, i) => (
                                    <View key={i} className="flex-row justify-between py-3 border-b border-gray-50">
                                        <Text className="text-gray-600 font-medium">Week {i + 1}</Text>
                                        <Text className="text-gray-800 font-bold">P {weeklyPayment.toFixed(2)}</Text>
                                    </View>
                                ))}
                                <View className="h-12" />
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    };

    // Step 3: Co-Maker Selection
    const CoMakerStep = () => {
        const toggleCoMaker = (id: string) => {
            if (selectedCoMakers.includes(id)) {
                setSelectedCoMakers(selectedCoMakers.filter(m => m !== id));
            } else {
                if (selectedCoMakers.length < 15) {
                    setSelectedCoMakers([...selectedCoMakers, id]);
                } else {
                    Alert.alert('Limit Reached', 'You can select up to 15 co-makers.');
                }
            }
        };

        return (
            <View>
                <Text className="text-gray-800 text-lg font-bold mb-2">Select Co-Makers</Text>
                <Text className="text-gray-500 text-sm mb-4">Select 2 to 15 members from your center to guarantee your loan.</Text>

                <View className="mb-4 bg-emerald-50 p-3 rounded-lg flex-row justify-between">
                    <Text className="text-[#047857] font-bold">Selected: {selectedCoMakers.length}/15</Text>
                    <Text className="text-gray-500 text-xs">Min: 2</Text>
                </View>

                {isLoadingMembers ? (
                    <ActivityIndicator color="#047857" className="my-8" />
                ) : members.length > 0 ? (
                    members.map((member) => (
                        <TouchableOpacity
                            key={member.id}
                            className={`p-4 rounded-xl border mb-3 flex-row items-center justify-between ${selectedCoMakers.includes(member.id) ? 'bg-[#047857]/10 border-[#047857]' : 'bg-white border-gray-100'}`}
                            onPress={() => toggleCoMaker(member.id)}
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="person" size={20} color="#4B5563" />
                                </View>
                                <View>
                                    <Text className="text-gray-800 font-bold">{member.full_name}</Text>
                                    <Text className="text-gray-500 text-xs text-capitalize">{member.role}</Text>
                                </View>
                            </View>
                            {selectedCoMakers.includes(member.id) && (
                                <Ionicons name="checkmark-circle" size={24} color="#047857" />
                            )}
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="bg-gray-50 p-6 rounded-xl items-center">
                        <Text className="text-gray-400">No members found in your center.</Text>
                    </View>
                )}
            </View>
        );
    };

    // Step 4: Document Uploads
    const DocumentsStep = () => {
        const docTypes = [
            { id: 'business_permit', label: 'Business Permit', icon: 'business' },
            { id: 'income_proof', label: 'Proof of Income', icon: 'cash' },
            { id: 'personal_id', label: 'Valid ID', icon: 'card' },
            { id: 'community_recommendation', label: 'Recommendation', icon: 'people' },
        ];

        const toggleDoc = async (id: string) => {
            if (uploadedDocuments[id]) {
                setUploadedDocuments(prev => {
                    const next = { ...prev };
                    delete next[id];
                    return next;
                });
            } else {
                try {
                    const result = await DocumentPicker.getDocumentAsync({
                        type: ['application/pdf', 'image/*'],
                        copyToCacheDirectory: true
                    });

                    if (result.canceled) return;

                    const file = result.assets[0];
                    setUploadingDocs(prev => ({ ...prev, [id]: true }));

                    const publicUrl = await uploadFile(file.uri, file.name, file.mimeType || 'application/octet-stream');

                    setUploadedDocuments(prev => ({ ...prev, [id]: publicUrl }));
                    setUploadingDocs(prev => ({ ...prev, [id]: false }));
                } catch (error) {
                    setUploadingDocs(prev => ({ ...prev, [id]: false }));
                    Alert.alert('Upload Failed', 'There was an error uploading your document.');
                }
            }
        };

        return (
            <View>
                <Text className="text-gray-800 text-lg font-bold mb-2">Requirement Uploads</Text>
                <Text className="text-gray-500 text-sm mb-6">Please upload the required documents for your loan application.</Text>

                {docTypes.map((doc) => (
                    <TouchableOpacity
                        key={doc.id}
                        onPress={() => !uploadingDocs[doc.id] && toggleDoc(doc.id)}
                        disabled={uploadingDocs[doc.id]}
                        className={`p-5 rounded-2xl border-2 mb-4 flex-row items-center justify-between ${uploadedDocuments[doc.id] ? 'bg-emerald-50 border-emerald-600' : 'bg-white border-gray-100'}`}
                    >
                        <View className="flex-row items-center">
                            <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${uploadedDocuments[doc.id] ? 'bg-emerald-600' : uploadingDocs[doc.id] ? 'bg-amber-100' : 'bg-gray-100'}`}>
                                {uploadingDocs[doc.id] ? (
                                    <ActivityIndicator size="small" color="#F59E0B" />
                                ) : (
                                    <Ionicons name={doc.icon as any} size={24} color={uploadedDocuments[doc.id] ? 'white' : '#4B5563'} />
                                )}
                            </View>
                            <View>
                                <Text className={`font-bold ${uploadedDocuments[doc.id] ? 'text-emerald-900' : 'text-gray-800'}`}>{doc.label}</Text>
                                <Text className="text-gray-400 text-xs">
                                    {uploadingDocs[doc.id] ? 'Uploading...' : uploadedDocuments[doc.id] ? 'Document Uploaded' : 'Tap to upload'}
                                </Text>
                            </View>
                        </View>
                        {uploadingDocs[doc.id] ? (
                            <ActivityIndicator size="small" color="#047857" />
                        ) : (
                            <Ionicons
                                name={uploadedDocuments[doc.id] ? "checkmark-circle" : "add-circle-outline"}
                                size={28}
                                color={uploadedDocuments[doc.id] ? "#059669" : "#D1D5DB"}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    // Step 5: Review Application
    const ReviewStep = () => (
        <View>
            <View className="bg-emerald-50 p-6 rounded-2xl items-center mb-6 border border-emerald-100">
                <Text className="text-gray-500 font-bold uppercase tracking-wider text-xs">Confirm Application</Text>
                <Text className="text-[#047857] text-4xl font-bold mt-2">P {loanAmount.toLocaleString()}</Text>
                <Text className="text-gray-600 font-medium mt-1">{selectedProduct?.name || 'Alwan Growth Loan'}</Text>
            </View>

            <View>
                <View className="flex-row justify-between py-3 border-b border-gray-50">
                    <Text className="text-gray-500">Applicant</Text>
                    <Text className="text-gray-900 font-bold">{profile?.full_name || 'Loading...'}</Text>
                </View>
                <View className="flex-row justify-between py-3 border-b border-gray-50">
                    <Text className="text-gray-500">Term</Text>
                    <Text className="text-gray-900 font-bold">{loanTerm} Weeks</Text>
                </View>
                <View className="flex-row justify-between py-3 border-b border-gray-50">
                    <Text className="text-gray-500">Weekly Payment</Text>
                    <Text className="text-gray-900 font-bold">P {((loanAmount * (1 + WEEKLY_INTEREST_RATE * loanTerm)) / loanTerm).toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between py-3 border-b border-gray-50">
                    <Text className="text-gray-500">Co-Makers</Text>
                    <Text className="text-gray-900 font-bold">{selectedCoMakers.length} Members</Text>
                </View>
                <View className="flex-row justify-between py-3 border-b border-gray-50">
                    <Text className="text-gray-500">Documents</Text>
                    <Text className="text-gray-900 font-bold">{Object.keys(uploadedDocuments).length} Files Attached</Text>
                </View>
                <View className="flex-row justify-between py-3 border-b border-gray-50">
                    <Text className="text-gray-500">Release Date</Text>
                    <Text className="text-gray-900 font-bold">Next Tuesday Meeting</Text>
                </View>
            </View>
        </View>
    );

    const handleNext = async () => {
        if (step < 5) {
            if (step === 3 && selectedCoMakers.length < 2) {
                Alert.alert('Required', 'Please select at least 2 co-makers.');
                return;
            }
            if (step === 4 && Object.keys(uploadedDocuments).length < 2) {
                Alert.alert('Incomplete', 'Please upload at least 2 required documents.');
                return;
            }
            setStep(step + 1);
        } else {
            if (isSubmitting) return;

            // Submit Application to Supabase
            try {
                setIsSubmitting(true);

                if (!user) {
                    Alert.alert('Error', 'You must be logged in to apply.');
                    return;
                }

                // 2. Insert Loan Application
                const weeklyPayment = Number(((loanAmount * (1 + WEEKLY_INTEREST_RATE * loanTerm)) / loanTerm).toFixed(2));

                const { data: loan, error: loanError } = await supabase
                    .from('loan_applications')
                    .insert({
                        user_id: user.id,
                        product_id: selectedProduct?.id || null,
                        amount: loanAmount,
                        term_weeks: loanTerm,
                        weekly_payment: weeklyPayment,
                        status: 'pending'
                    })
                    .select()
                    .single();

                if (loanError) throw loanError;

                // 3. Insert Co-Makers (Filter out mock IDs to avoid DB errors)
                const realCoMakers = selectedCoMakers.filter(id => !id.startsWith('mock-'));

                if (realCoMakers.length > 0 && loan) {
                    const coMakerInserts = realCoMakers.map(cmId => ({
                        loan_application_id: loan.id,
                        co_maker_id: cmId,
                        status: 'pending'
                    }));

                    const { error: cmError } = await supabase
                        .from('loan_co_makers')
                        .insert(coMakerInserts);

                    if (cmError) console.error('Co-maker insert failed:', cmError);
                } else if (selectedCoMakers.length > 0) {
                    console.log('Skipping DB insert for mock co-makers:', selectedCoMakers);
                }

                // 4. Insert Loan Document Verifications
                const docEntries = Object.entries(uploadedDocuments).map(([type, url]) => ({
                    loan_application_id: loan.id,
                    document_type: type,
                    document_url: url,
                    verification_status: 'pending'
                }));

                if (docEntries.length > 0) {
                    const { error: docError } = await supabase
                        .from('loan_document_verifications')
                        .insert(docEntries);

                    if (docError) console.error('Document verification insert failed:', docError);
                }

                // Show Success Screen
                setIsSuccess(true);

            } catch (error: any) {
                console.error('Submission Error:', error);
                Alert.alert('Submission Failed', error.message || 'There was an error submitting your application.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (isSuccess) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-6">
                <StatusBar style="dark" />
                <View className="w-24 h-24 bg-emerald-100 rounded-full items-center justify-center mb-6">
                    <Ionicons name="checkmark" size={60} color="#047857" />
                </View>
                <Text className="text-2xl font-bold text-gray-800 text-center mb-2">Application Successful!</Text>
                <Text className="text-gray-500 text-center mb-8">
                    Your loan application has been submitted and is now pending review.
                </Text>
                <TouchableOpacity
                    className="bg-[#047857] w-full py-4 rounded-xl items-center shadow-lg"
                    onPress={() => router.replace('/loans/active-loans')}
                >
                    <Text className="text-white font-bold text-lg">Go to My Loans</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="bg-white pt-12 pb-4 px-6 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-800">Apply for Loan</Text>
                    <View className="w-6" />
                </View>
                {/* Progress Bar */}
                <View className="flex-row mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <View className="bg-[#047857] h-full" style={{ width: `${(step / 5) * 100}%` }} />
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                {step === 1 && <EligibilityStep />}
                {step === 2 && <CalculatorStep />}
                {step === 3 && <CoMakerStep />}
                {step === 4 && <DocumentsStep />}
                {step === 5 && <ReviewStep />}
            </ScrollView>

            {/* Footer Actions */}
            <View className="p-6 border-t border-gray-50">
                <TouchableOpacity
                    className={`bg-[#047857] w-full py-4 rounded-xl items-center shadow-lg active:opacity-90 ${isSubmitting ? 'opacity-70' : ''}`}
                    onPress={handleNext}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">
                            {step === 5 ? 'Submit Application' : 'Next Step'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
