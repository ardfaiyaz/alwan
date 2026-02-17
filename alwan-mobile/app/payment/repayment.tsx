import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

type NextPayment = {
    week_number: number;
    amount_due: number;
    due_date: string;
    loan_name: string;
};

export default function RepaymentScreen() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [nextPayment, setNextPayment] = useState<NextPayment | null>(null);

    useEffect(() => {
        fetchNextPayment();
    }, [user]);

    const fetchNextPayment = async () => {
        if (!user) return;

        try {
            setIsLoading(true);

            // Get user's active loan
            const { data: activeLoan } = await supabase
                .from('loan_applications')
                .select('id, loan_products(name)')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .limit(1)
                .maybeSingle();

            if (activeLoan) {
                // Get next unpaid amortization
                const { data: amort } = await supabase
                    .from('amortizations')
                    .select('*')
                    .eq('loan_application_id', activeLoan.id)
                    .eq('status', 'unpaid')
                    .order('due_date', { ascending: true })
                    .limit(1)
                    .maybeSingle();

                if (amort) {
                    setNextPayment({
                        week_number: amort.week_number,
                        amount_due: amort.amount_due,
                        due_date: amort.due_date,
                        loan_name: (activeLoan as any).loan_products?.name || 'Alwan Growth Loan',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching next payment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="bg-[#047857] pt-12 pb-8 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">Submit Repayment</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                <Text className="text-gray-800 text-lg font-bold mb-4">Select Amortization</Text>

                {isLoading ? (
                    <ActivityIndicator color="#047857" className="my-8" />
                ) : nextPayment ? (
                    <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                        <Text className="text-gray-600 font-medium">Week {nextPayment.week_number} - {nextPayment.loan_name}</Text>
                        <Text className="text-[#047857] text-2xl font-bold mt-1">
                            P {Number(nextPayment.amount_due).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                        <Text className="text-gray-400 text-xs mt-1">
                            Due Date: {new Date(nextPayment.due_date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
                        </Text>
                    </View>
                ) : (
                    <View className="bg-gray-50 p-6 rounded-xl items-center mb-6">
                        <Text className="text-gray-400">No pending amortizations</Text>
                    </View>
                )}

                <Text className="text-gray-800 text-lg font-bold mb-4">Payment Method</Text>
                <TouchableOpacity className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl mb-3 shadow-sm">
                    <Ionicons name="people" size={24} color="#047857" />
                    <Text className="text-gray-700 font-medium ml-3">Center Collection</Text>
                    <View className="flex-1" />
                    <Ionicons name="checkmark-circle" size={24} color="#047857" />
                </TouchableOpacity>

                <TouchableOpacity
                    className={`bg-[#047857] py-4 rounded-full items-center mt-8 shadow-lg ${!nextPayment ? 'opacity-50' : ''}`}
                    disabled={!nextPayment}
                    onPress={() => {
                        Alert.alert('Repayment Submitted', 'Your repayment has been recorded successfully.');
                        router.back();
                    }}
                >
                    <Text className="text-white font-bold text-lg">Confirm Payment</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
