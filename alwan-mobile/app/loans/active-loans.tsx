import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

type LoanApplication = {
    id: string;
    amount: number;
    term_weeks: number;
    weekly_payment: number;
    status: 'pending' | 'approved' | 'active' | 'rejected' | 'fully_paid';
    submitted_at: string;
};

type Amortization = {
    id: string;
    week_number: number;
    due_date: string;
    amount_due: number;
    status: string;
};

export default function LoansScreen() {
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const [loans, setLoans] = useState<LoanApplication[]>([]);
    const [nextAmortization, setNextAmortization] = useState<Amortization | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmingLoanId, setConfirmingLoanId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchLoansData();
        }
    }, [user]);

    const cancelApplication = async (loanId: string) => {
        console.log('Attempting to cancel loan:', loanId);
        try {
            setIsLoading(true);

            // 1. Check if document verifications exist
            const { data: existingDocs, error: checkError } = await supabase
                .from('loan_document_verifications')
                .select('id', { count: 'exact' })
                .eq('loan_application_id', loanId);

            console.log('Existing doc verifications:', existingDocs?.length || 0);

            // 2. Delete associated document verifications first (FK constraint)
            if (existingDocs && existingDocs.length > 0) {
                const { error: dvError, count: dvCount } = await supabase
                    .from('loan_document_verifications')
                    .delete({ count: 'exact' })
                    .eq('loan_application_id', loanId);

                console.log('Doc verifications deleted:', dvCount, 'Error:', dvError);

                if (dvError) {
                    console.error('Document verification deletion error:', dvError);
                    throw new Error('Could not delete document verifications: ' + dvError.message);
                }

                if (dvCount === 0 && existingDocs.length > 0) {
                    throw new Error('Document verifications exist but could not be deleted. Please check your RLS DELETE policy on loan_document_verifications table.');
                }
            }

            // 3. Delete associated co-makers (FK constraint)
            const { error: cmError } = await supabase
                .from('loan_co_makers')
                .delete()
                .eq('loan_application_id', loanId);

            if (cmError) {
                console.warn('Co-maker deletion error (might be none):', cmError);
            }

            // 4. Delete the loan application
            const { error, count } = await supabase
                .from('loan_applications')
                .delete({ count: 'exact' })
                .eq('id', loanId);

            if (error) {
                console.error('Database delete error:', error);
                throw error;
            }

            if (count === 0) {
                throw new Error('You do not have permission to delete this application. Please check your database RLS policies.');
            }

            console.log('Loan cancelled successfully');
            Alert.alert('Success', 'Application cancelled successfully.');
            setConfirmingLoanId(null);
            await fetchLoansData();
        } catch (error: any) {
            console.error('Final catch error in cancelApplication:', error);
            Alert.alert('Error', error.message || 'Could not cancel application. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLoansData = async () => {
        try {
            setIsLoading(true);

            // 1. Fetch Loan Applications
            const { data: loanData, error: loanError } = await supabase
                .from('loan_applications')
                .select('*')
                .eq('user_id', user?.id)
                .order('submitted_at', { ascending: false });

            if (loanError) throw loanError;
            setLoans(loanData || []);

            // 2. Fetch Next Amortization if there's an active loan
            const activeLoan = loanData?.find(l => l.status === 'active');
            if (activeLoan) {
                const { data: amortData } = await supabase
                    .from('amortizations')
                    .select('*')
                    .eq('loan_application_id', activeLoan.id)
                    .eq('status', 'unpaid')
                    .order('due_date', { ascending: true })
                    .limit(1)
                    .single();

                if (amortData) setNextAmortization(amortData);
            }

        } catch (error: any) {
            console.error('Error fetching loans:', error);
            Alert.alert('Error', 'Could not load loan information.');
        } finally {
            setIsLoading(false);
        }
    };

    const activeLoan = loans.find(l => l.status === 'active');
    const pendingLoan = loans.find(l => l.status === 'pending');

    if (isLoading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#047857" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="bg-[#047857] pt-12 pb-8 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">My Loans</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                {pendingLoan && (
                    <View className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm mb-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center">
                                <Ionicons name="time" size={24} color="#F97316" />
                                <Text className="text-[#F97316] font-bold text-lg ml-2">Application Pending</Text>
                            </View>
                            {confirmingLoanId === pendingLoan.id ? (
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        onPress={() => setConfirmingLoanId(null)}
                                        className="mr-3"
                                    >
                                        <Text className="text-gray-400 text-xs font-bold">No</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => cancelApplication(pendingLoan.id)}
                                        className="bg-red-500 px-3 py-1.5 rounded-full"
                                    >
                                        <Text className="text-white text-xs font-bold">Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('Cancel initiated for:', pendingLoan.id);
                                        setConfirmingLoanId(pendingLoan.id);
                                    }}
                                    className="bg-white/50 px-4 py-2 rounded-full border border-orange-200"
                                >
                                    <Text className="text-orange-700 text-xs font-bold">Cancel</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text className="text-gray-700 mb-2">
                            Your application for <Text className="font-bold">P {pendingLoan.amount.toLocaleString()}</Text> is being reviewed by the Credit Committee.
                        </Text>
                        <View className="bg-white/50 p-3 rounded-lg">
                            <Text className="text-gray-500 text-xs">Expected Feedback: <Text className="font-bold text-gray-800">Next Tuesday Meeting</Text></Text>
                        </View>
                    </View>
                )}

                {activeLoan ? (
                    <View>
                        <Text className="text-gray-800 text-lg font-bold mb-4">Active Loan</Text>
                        <View className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">
                            <View className="flex-row justify-between mb-4">
                                <Text className="text-gray-500 font-bold">Alwan Growth Loan</Text>
                                <View className="bg-green-100 px-3 py-1 rounded-full">
                                    <Text className="text-green-700 text-[10px] font-bold uppercase">Active</Text>
                                </View>
                            </View>
                            <Text className="text-[#047857] text-3xl font-bold">P {activeLoan.amount.toLocaleString()}</Text>
                            <Text className="text-gray-400 text-xs mt-1">Principal Amount</Text>

                            {nextAmortization && (
                                <View className="mt-4 pt-4 border-t border-gray-50 flex-row justify-between">
                                    <View>
                                        <Text className="text-gray-400 text-[10px] uppercase">Next Pay</Text>
                                        <Text className="text-gray-800 font-bold">
                                            {new Date(nextAmortization.due_date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
                                        </Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-gray-400 text-[10px] uppercase">Progress</Text>
                                        <Text className="text-gray-800 font-bold">Week {nextAmortization.week_number} / {activeLoan.term_weeks}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                ) : !pendingLoan && (
                    <View className="items-center py-12">
                        <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
                            <Ionicons name="card-outline" size={40} color="#D1D5DB" />
                        </View>
                        <Text className="text-gray-500 font-bold text-lg">No Active Loans</Text>
                        <Text className="text-gray-400 text-sm text-center mt-2 px-12">
                            Apply for an Alwan Growth Loan to support your community business.
                        </Text>
                    </View>
                )}

                {!activeLoan && !pendingLoan && (
                    <TouchableOpacity
                        className="bg-[#047857] py-4 rounded-xl items-center shadow-lg mt-4"
                        onPress={() => router.push('/loans/apply')}
                    >
                        <Text className="text-white font-bold">Apply for New Loan</Text>
                    </TouchableOpacity>
                )}

                {loans.filter(l => l.status === 'fully_paid').length > 0 && (
                    <View className="mt-8">
                        <Text className="text-gray-800 text-lg font-bold mb-4">Past Loans</Text>
                        {loans.filter(l => l.status === 'fully_paid').map(loan => (
                            <View key={loan.id} className="bg-gray-50 rounded-2xl p-4 mb-4 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-gray-800 font-bold">P {loan.amount.toLocaleString()}</Text>
                                    <Text className="text-gray-400 text-xs">{new Date(loan.submitted_at).toLocaleDateString()}</Text>
                                </View>
                                <View className="bg-gray-200 px-3 py-1 rounded-full">
                                    <Text className="text-gray-600 text-[10px] font-bold uppercase">Fully Paid</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
