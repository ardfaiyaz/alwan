import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function RequiredAccountsScreen() {
  const router = useRouter();
  const { createSavingsAccount, createInsuranceAccount, savingsAccount, insuranceAccount } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const insurancePlans = [
    { id: 'basic', name: 'Basic Plan', premium: 50, coverage: '₱50,000' },
    { id: 'standard', name: 'Standard Plan', premium: 100, coverage: '₱100,000' },
    { id: 'premium', name: 'Premium Plan', premium: 150, coverage: '₱200,000' },
  ];

  const handleCreateSavings = () => {
    console.log('[RequiredAccounts] Creating savings account');
    createSavingsAccount();
    console.log('[RequiredAccounts] Savings account created');
    Alert.alert('Success', 'Savings account created successfully!');
  };

  const handleCreateInsurance = () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select an insurance plan');
      return;
    }

    const plan = insurancePlans.find(p => p.id === selectedPlan);
    if (!plan) return;

    console.log('[RequiredAccounts] Creating insurance account');
    console.log('[RequiredAccounts] Plan:', plan.name, 'Premium:', plan.premium);
    createInsuranceAccount(plan.name, plan.premium);
    console.log('[RequiredAccounts] Insurance account created');
    Alert.alert('Success', 'Insurance account created successfully!');
  };

  const handleContinue = () => {
    if (!savingsAccount || !insuranceAccount) {
      Alert.alert('Required', 'Please create both savings and insurance accounts to continue.');
      return;
    }

    console.log('[RequiredAccounts] Both accounts created - redirecting to homepage');
    Alert.alert(
      'Accounts Created!',
      'Your savings and insurance accounts are now active. Your loan will be disbursed shortly.',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Required Accounts</Text>
          <Text className="text-sm text-gray-600 mt-2">
            Open savings and insurance accounts before loan disbursement
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Info Alert */}
          <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#3B82F6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-900 font-semibold mb-1">Why These Accounts?</Text>
                <Text className="text-blue-800 text-sm">
                  KMBI requires all loan recipients to have savings and insurance accounts. This ensures financial security and builds your savings habit.
                </Text>
              </View>
            </View>
          </View>

          {/* Savings Account */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">1. Savings Account</Text>
            <View className={`border-2 rounded-2xl p-4 ${savingsAccount ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${savingsAccount ? 'bg-green-100' : 'bg-purple-100'}`}>
                    <Ionicons name="wallet" size={24} color={savingsAccount ? '#10B981' : '#8B5CF6'} />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900">KMBI Savings</Text>
                    <Text className="text-sm text-gray-600">Build your financial future</Text>
                  </View>
                </View>
                {savingsAccount && (
                  <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                )}
              </View>

              <View className="space-y-2 mb-4">
                <View className="flex-row items-start">
                  <Ionicons name="checkmark" size={16} color="#6B7280" />
                  <Text className="flex-1 text-sm text-gray-700 ml-2">
                    No minimum balance required
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <Ionicons name="checkmark" size={16} color="#6B7280" />
                  <Text className="flex-1 text-sm text-gray-700 ml-2">
                    Earn interest on your savings
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <Ionicons name="checkmark" size={16} color="#6B7280" />
                  <Text className="flex-1 text-sm text-gray-700 ml-2">
                    Weekly deposits during group meetings
                  </Text>
                </View>
              </View>

              {!savingsAccount && (
                <TouchableOpacity
                  onPress={handleCreateSavings}
                  className="bg-purple-600 py-3 rounded-xl"
                >
                  <Text className="text-white text-center font-semibold">
                    Create Savings Account
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Insurance Account */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">2. Insurance Account</Text>
            <View className={`border-2 rounded-2xl p-4 ${insuranceAccount ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${insuranceAccount ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <Ionicons name="shield-checkmark" size={24} color={insuranceAccount ? '#10B981' : '#F59E0B'} />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900">Microinsurance</Text>
                    <Text className="text-sm text-gray-600">Protect your family</Text>
                  </View>
                </View>
                {insuranceAccount && (
                  <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                )}
              </View>

              {!insuranceAccount ? (
                <>
                  <Text className="text-sm font-semibold text-gray-900 mb-3">Select a plan:</Text>
                  {insurancePlans.map((plan) => (
                    <TouchableOpacity
                      key={plan.id}
                      onPress={() => setSelectedPlan(plan.id)}
                      className={`border-2 rounded-xl p-3 mb-2 ${
                        selectedPlan === plan.id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                      }`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="font-semibold text-gray-900">{plan.name}</Text>
                          <Text className="text-sm text-gray-600">Coverage: {plan.coverage}</Text>
                        </View>
                        <Text className="text-lg font-bold text-gray-900">₱{plan.premium}/week</Text>
                      </View>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={handleCreateInsurance}
                    disabled={!selectedPlan}
                    className={`py-3 rounded-xl mt-3 ${selectedPlan ? 'bg-yellow-600' : 'bg-gray-300'}`}
                  >
                    <Text className="text-white text-center font-semibold">
                      Create Insurance Account
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View className="bg-green-100 rounded-lg p-3">
                  <Text className="text-green-900 text-sm">
                    ✓ {insuranceAccount.plan} - ₱{insuranceAccount.premium}/week
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Continue Button */}
          {savingsAccount && insuranceAccount && (
            <TouchableOpacity
              onPress={handleContinue}
              className="bg-[#009245] py-4 rounded-xl"
            >
              <Text className="text-white text-center text-base font-semibold">
                Continue to Dashboard
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
