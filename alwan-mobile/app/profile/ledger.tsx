import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

type AmortizationRecord = {
    id: string;
    week_number: number;
    amount_due: number;
    due_date: string;
    status: string;
};

export default function LedgerScreen() {
    const { user } = useAuth();
    const [amortizations, setAmortizations] = useState<AmortizationRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLedger();
    }, [user]);

    const fetchLedger = async () => {
        if (!user) return;
        try {
            setIsLoading(true);

            // Get user's loans (active or fully_paid)
            const { data: loans } = await supabase
                .from('loan_applications')
                .select('id')
                .eq('user_id', user.id)
                .in('status', ['active', 'fully_paid', 'pending']);

            if (loans && loans.length > 0) {
                const loanIds = loans.map(l => l.id);

                const { data: allAmorts } = await supabase
                    .from('amortizations')
                    .select('*')
                    .in('loan_application_id', loanIds)
                    .order('due_date', { ascending: false });

                setAmortizations(allAmorts || []);
            }
        } catch (error) {
            console.error('Error fetching ledger:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return '#047857';
            case 'unpaid': return '#F97316';
            case 'late': return '#EF4444';
            default: return '#9CA3AF';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Success';
            case 'unpaid': return 'Pending';
            case 'late': return 'Late';
            default: return status;
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
                    <Text className="text-white text-xl font-bold ml-4">Payment Ledger</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                <Text className="text-gray-800 text-lg font-bold mb-4">Transaction History</Text>

                {isLoading ? (
                    <ActivityIndicator color="#047857" className="my-8" />
                ) : amortizations.length > 0 ? (
                    amortizations.map((item) => (
                        <View key={item.id} className="flex-row items-center justify-between p-4 border-b border-gray-50">
                            <View>
                                <Text className="text-gray-800 font-bold">Week {item.week_number} Payment</Text>
                                <Text className="text-gray-400 text-xs">
                                    {new Date(item.due_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-gray-800 font-bold">P {Number(item.amount_due).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                                <Text style={{ color: getStatusColor(item.status) }} className="text-[10px] font-bold uppercase">
                                    {getStatusLabel(item.status)}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="bg-gray-50 p-6 rounded-xl items-center">
                        <Text className="text-gray-400">No payment records yet</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
