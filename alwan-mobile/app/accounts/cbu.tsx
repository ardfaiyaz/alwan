import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

type CBUTransaction = {
    id: string;
    amount: number;
    description: string;
    created_at: string;
    transaction_type: string;
};

export default function CBUScreen() {
    const { profile, user } = useAuth();
    const [transactions, setTransactions] = useState<CBUTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCBUActivity();
    }, [user]);

    const fetchCBUActivity = async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            // Fetch recent savings transactions that relate to CBU
            const { data } = await supabase
                .from('savings_transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching CBU activity:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const cbuBalance = profile?.cbu_balance || 0;

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="bg-[#047857] pt-12 pb-8 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">CBU Savings</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                <View className="bg-emerald-50 p-6 rounded-2xl items-center mb-8">
                    <Text className="text-gray-500 font-medium uppercase tracking-wider">Total CBU Balance</Text>
                    <Text className="text-[#047857] text-4xl font-bold mt-2">
                        P {cbuBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Text>
                </View>

                <Text className="text-gray-800 text-lg font-bold mb-4">Add Capital</Text>
                <TouchableOpacity className="bg-white border border-dashed border-[#047857] p-8 rounded-2xl items-center mb-6">
                    <Ionicons name="add-circle-outline" size={40} color="#047857" />
                    <Text className="text-[#047857] font-bold mt-2">Deposit to CBU</Text>
                </TouchableOpacity>

                <Text className="text-gray-800 text-lg font-bold mb-4">Recent Activity</Text>
                {isLoading ? (
                    <ActivityIndicator color="#047857" className="my-8" />
                ) : transactions.length > 0 ? (
                    <View className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        {transactions.map((tx, idx) => (
                            <View key={tx.id} className={`flex-row justify-between p-4 ${idx !== transactions.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                <View>
                                    <Text className="text-gray-800 font-medium">{tx.description || 'CBU Transaction'}</Text>
                                    <Text className="text-gray-400 text-xs">{new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</Text>
                                </View>
                                <Text className={`${tx.transaction_type === 'withdrawal' ? 'text-red-500' : 'text-green-600'} font-bold`}>
                                    {tx.transaction_type === 'withdrawal' ? '-' : '+'}P {Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View className="bg-gray-50 p-6 rounded-xl items-center">
                        <Text className="text-gray-400">No CBU activity yet</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
