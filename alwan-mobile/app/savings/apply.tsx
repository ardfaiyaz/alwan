import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

import ErrorModal from '../../components/ui/ErrorModal';
import SuccessModal from '../../components/ui/SuccessModal';

type SavingsType = 'standard' | 'emergency' | 'goal-based';

export default function ApplySavingsScreen() {
    const router = useRouter();
    const { user, refreshProfile } = useAuth();
    const [savingsType, setSavingsType] = useState<SavingsType>('standard');
    const [goalAmount, setGoalAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async () => {
        if (!user) {
            setErrorMessage('Please log in to create a savings account');
            return;
        }

        // More robust goal amount validation
        if (savingsType === 'goal-based') {
            const parsedAmount = Number(goalAmount.replace(/[,]/g, ''));
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                setErrorMessage('Please enter a valid goal amount.');
                return;
            }
            setGoalAmount(parsedAmount.toLocaleString()); // Format for display
        }

        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            const { error } = await supabase
                .from('savings_accounts')
                .insert({
                    user_id: user.id,
                    savings_type: savingsType,
                    balance: 0,
                    goal_amount: savingsType === 'goal-based' ? Number(goalAmount.replace(/[,]/g, '')) : null,
                    interest_rate: 0.05,
                    status: 'active',
                    start_date: new Date().toISOString(),
                    last_deposit_at: new Date().toISOString()
                });

            if (error) throw error;

            await refreshProfile();
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error('Error opening savings account:', error);
            setErrorMessage(
                error.message ||
                'Failed to open account. Please check your connection.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const typeOptions = [
        { id: 'standard', name: 'Standard Savings', desc: 'Secure your money and earn interest.', icon: 'wallet-outline' },
        { id: 'emergency', name: 'Emergency Fund', desc: 'Set aside funds for unexpected needs.', icon: 'shield-checkmark-outline' },
        { id: 'goal-based', name: 'Goal-Based Savings', desc: 'Save for a specific project or purchase.', icon: 'rocket-outline' },
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="pt-12 pb-4 px-6 border-b border-gray-100 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-800">New Savings Account</Text>
                <View className="w-6" />
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                <Text className="text-gray-500 text-sm mb-6">
                    Choose the type of savings account you'd like to open.
                </Text>

                {typeOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        className={`p-4 rounded-2xl border mb-4 flex-row items-center ${savingsType === option.id ? 'bg-[#047857]/5 border-[#047857]' : 'bg-white border-gray-100'}`}
                        onPress={() => setSavingsType(option.id as SavingsType)}
                    >
                        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${savingsType === option.id ? 'bg-[#047857]' : 'bg-gray-100'}`}>
                            <Ionicons name={option.icon as any} size={24} color={savingsType === option.id ? 'white' : '#4B5563'} />
                        </View>
                        <View className="flex-1">
                            <Text className={`font-bold ${savingsType === option.id ? 'text-[#047857]' : 'text-gray-800'}`}>
                                {option.name}
                            </Text>
                            <Text className="text-gray-500 text-xs mt-1">{option.desc}</Text>
                        </View>
                        {savingsType === option.id && (
                            <Ionicons name="checkmark-circle" size={24} color="#047857" />
                        )}
                    </TouchableOpacity>
                ))}

                {savingsType === 'goal-based' && (
                    <View className="mt-4 animate-in fade-in duration-300">
                        <Text className="text-gray-800 font-bold mb-2">Savings Goal Amount</Text>
                        <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center border border-gray-100">
                            <Text className="text-gray-400 font-bold mr-2 text-lg">P</Text>
                            <TextInput
                                className="flex-1 text-lg font-bold text-gray-800"
                                placeholder="5,000.00"
                                keyboardType="numeric"
                                value={goalAmount}
                                onChangeText={setGoalAmount}
                                autoFocus
                            />
                        </View>
                        <Text className="text-gray-400 text-[10px] mt-2 italic px-1">
                            We'll help you track your progress toward this amount.
                        </Text>
                    </View>
                )}

                <View className="bg-emerald-50 p-4 rounded-xl mt-8">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="information-circle" size={20} color="#047857" />
                        <Text className="text-[#047857] font-bold ml-2 text-sm">Account Terms</Text>
                    </View>
                    <Text className="text-gray-600 text-xs leading-relaxed">
                        • Earn 5.00% annual interest rate.{"\n"}
                        • No maintaining balance required.{"\n"}
                        • Deposits and withdrawals are processed instantly.
                    </Text>
                </View>

                <View className="h-20" />
            </ScrollView>

            <View className="p-6 border-t border-gray-50">
                <TouchableOpacity
                    className={`bg-[#047857] w-full py-4 rounded-xl items-center shadow-lg active:opacity-90 ${isSubmitting ? 'opacity-70' : ''}`}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Open Account</Text>
                    )}
                </TouchableOpacity>
                <ErrorModal
                    visible={!!errorMessage}
                    message={errorMessage || ''}
                    onClose={() => setErrorMessage(null)}
                />

                <SuccessModal
                    visible={showSuccessModal}
                    message="Your new savings account has been opened successfully! You can now start saving towards your goals."
                    onClose={() => {
                        setShowSuccessModal(false);
                        router.back();
                    }}
                />
            </View>
        </View>
    );
}
