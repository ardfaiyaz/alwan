import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import ConfirmModal from '../../components/ui/ConfirmModal';
import SuccessModal from '../../components/ui/SuccessModal';
import ErrorModal from '../../components/ui/ErrorModal';

type SavingsAccount = {
    id: string;
    balance: number;
    savings_type: string;
    goal_amount: number | null;
    interest_rate: number;
    status: string;
};

type SavingsTransaction = {
    id: string;
    amount: number;
    transaction_type: string;
    description: string;
    created_at: string;
};

export default function SavingsScreen() {
    const router = useRouter();
    const { profile, user } = useAuth();
    const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
    const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchSavingsData = useCallback(async () => {
        if (!user) return;

        try {
            setIsLoading(true);

            // 1. Fetch Savings Accounts
            const { data: accountsData, error: accountsError } = await supabase
                .from('savings_accounts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (accountsError) throw accountsError;
            setAccounts(accountsData || []);

            // 2. Fetch Recent Transactions
            const { data: txData, error: txError } = await supabase
                .from('savings_transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (txError) throw txError;
            setTransactions(txData || []);

        } catch (error: any) {
            console.error('Error fetching savings data:', error);
            // Silent error on background refresh, only alert on initial load if needed
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const handleCloseAccount = useCallback((accountId: string) => {
        console.log('handleCloseAccount triggered for:', accountId);
        setItemToDelete(accountId);
        setShowConfirmModal(true);
    }, []);

    const performDelete = async () => {
        if (!itemToDelete) return;

        console.log('Starting Supabase delete for:', itemToDelete);
        try {
            setIsDeleting(true);
            const { error } = await supabase
                .from('savings_accounts')
                .delete()
                .eq('id', itemToDelete);

            if (error) {
                console.error('Supabase Delete Error:', error);
                setErrorMessage(`Failed to delete: ${error.message}`);
                return;
            }

            console.log('Delete successful in database');
            setSuccessMessage('Your savings plan has been deleted successfully.');
            setShowConfirmModal(false);
            setItemToDelete(null);
            fetchSavingsData();
        } catch (error: any) {
            console.error('Catch Error during delete:', error);
            setErrorMessage('An unexpected error occurred while deleting.');
        } finally {
            setIsDeleting(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSavingsData();
        }, [fetchSavingsData])
    );

    // Use profile.total_savings which is updated by DB trigger
    const totalSavings = profile?.total_savings || 0;

    if (isLoading && !profile) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#047857" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />
            <View className="bg-[#047857] pt-12 pb-8 px-6">
                <Text className="text-white text-2xl font-bold">My Savings</Text>
                <Text className="text-white/80 text-sm mt-1">Manage your community capital</Text>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                {/* Total Balance Card */}
                <View className="bg-emerald-50 p-6 rounded-2xl items-center mb-8 border border-emerald-100">
                    <Text className="text-gray-500 font-medium uppercase tracking-wider text-xs">Total Savings</Text>
                    <Text className="text-[#047857] text-4xl font-bold mt-2">
                        P {totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Text>
                    {profile?.savings_goal && (
                        <View className="w-full mt-4">
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-gray-400 text-[10px] font-bold uppercase">Overall Goal Progress</Text>
                                <Text className="text-[#047857] text-[10px] font-bold">
                                    {Math.round((totalSavings / profile.savings_goal) * 100)}%
                                </Text>
                            </View>
                            <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <View
                                    className="bg-[#047857] h-full"
                                    style={{ width: `${Math.min(100, (totalSavings / profile.savings_goal) * 100)}%` }}
                                />
                            </View>
                        </View>
                    )}
                </View>

                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-gray-800 text-lg font-bold">Your Accounts</Text>
                    <TouchableOpacity onPress={() => router.push('/savings/apply')}>
                        <Ionicons name="add-circle" size={24} color="#047857" />
                    </TouchableOpacity>
                </View>

                {/* CBU Account (from Profile) */}
                <View
                    className="bg-white border border-gray-100 p-5 rounded-2xl mb-4 shadow-sm"
                >
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mr-3">
                                <Ionicons name="wallet" size={20} color="#047857" />
                            </View>
                            <View>
                                <Text className="text-gray-800 font-bold">Capital Build Up (CBU)</Text>
                                <Text className="text-gray-400 text-[10px]">Community Capital</Text>
                            </View>
                        </View>
                        <Text className="text-[#047857] text-lg font-bold">P {(profile?.cbu_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                    </View>
                </View>

                {/* Savings Accounts from Table */}
                {accounts.map((item) => {
                    const progress = item.goal_amount ? (item.balance / item.goal_amount) * 100 : 0;
                    return (
                        <View
                            key={item.id}
                            className="bg-white border border-gray-100 p-5 rounded-2xl mb-4 shadow-sm"
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mr-3">
                                        <Ionicons
                                            name={item.savings_type === 'emergency' ? 'shield' : 'rocket'}
                                            size={20}
                                            color="#047857"
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-gray-800 font-bold capitalize">{item.savings_type} Savings</Text>
                                        <Text className="text-gray-400 text-[10px]">Earns {item.interest_rate * 100}% p.a.</Text>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <Text className="text-[#047857] text-lg font-bold">P {(Number(item.balance) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log('Close Plan button pressed');
                                            handleCloseAccount(item.id);
                                        }}
                                        className="mt-2 py-2 px-3 bg-red-50 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-red-500 text-xs font-bold uppercase text-center">Delete Plan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {item.goal_amount && (
                                <View className="mt-2">
                                    <View className="flex-row justify-between mb-1">
                                        <Text className="text-gray-400 text-[10px] font-bold">GOAL: P {item.goal_amount.toLocaleString()}</Text>
                                        <Text className="text-[#047857] text-[10px] font-bold">{Math.round(progress)}%</Text>
                                    </View>
                                    <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <View
                                            className="bg-[#047857] h-full"
                                            style={{ width: `${Math.min(100, progress)}%` }}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })}

                <View className="mt-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-800 text-lg font-bold">Transaction History</Text>
                        <TouchableOpacity onPress={fetchSavingsData}>
                            <Ionicons name="refresh" size={18} color="#047857" />
                        </TouchableOpacity>
                    </View>
                    {transactions.length > 0 ? (
                        <View className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                            {transactions.map((tx, idx) => (
                                <View key={tx.id} className={`flex-row justify-between p-4 ${idx !== transactions.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                    <View className="flex-1">
                                        <Text className="text-gray-800 font-medium" numberOfLines={1}>
                                            {tx.description || tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1)}
                                        </Text>
                                        <Text className="text-gray-400 text-xs">{new Date(tx.created_at).toLocaleDateString()}</Text>
                                    </View>
                                    <Text className={`${tx.transaction_type === 'withdrawal' ? 'text-red-500' : 'text-green-600'} font-bold ml-2`}>
                                        {tx.transaction_type === 'withdrawal' ? '-' : '+'}P {Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="bg-gray-50 p-6 rounded-2xl items-center border border-dashed border-gray-200">
                            <Text className="text-gray-400">No recent savings transactions</Text>
                        </View>
                    )}
                </View>
                <View className="h-10" />
            </ScrollView>

            <ConfirmModal
                visible={showConfirmModal}
                title="Delete Plan?"
                message="Are you sure you want to permanently delete this savings plan? This action cannot be undone."
                confirmText={isDeleting ? 'Deleting...' : 'Delete Plan'}
                cancelText="Keep Plan"
                isDestructive
                onConfirm={performDelete}
                onCancel={() => {
                    setShowConfirmModal(false);
                    setItemToDelete(null);
                }}
            />

            <SuccessModal
                visible={!!successMessage}
                title="Plan Deleted"
                message={successMessage || ''}
                onClose={() => setSuccessMessage(null)}
            />

            <ErrorModal
                visible={!!errorMessage}
                message={errorMessage || ''}
                onClose={() => setErrorMessage(null)}
            />
        </View>
    );
}
