import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user, userGroup, loanApplication, savingsAccount, insuranceAccount, paymentSchedules } = useAuth();

  // Calculate savings balance (mock data)
  const savingsBalance = 3250;
  const savingsThisWeek = 250;

  // Check if loan is approved
  const isLoanApproved = loanApplication?.status === 'approved';

  const handleLoanClick = () => {
    console.log('[HomeScreen] handleLoanClick called');

    if (!user?.isApproved) {
      console.log('[HomeScreen] User not approved - showing alert');
      Alert.alert(
        'Account Pending',
        'Your membership is still pending approval. Please wait for admin verification.',
        [{ text: 'OK' }]
      );
      return;
    }

    // NEW FLOW: Must join group first before applying for loan
    if (!userGroup) {
      console.log('[HomeScreen] User has no group - must join group first');
      Alert.alert(
        'Join a Group First',
        'You need to join a solidarity group before applying for a loan. Groups provide mutual support and guarantee each other\'s loans.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join Group', onPress: () => router.push('/loans/join-group') }
        ]
      );
      return;
    }

    // If in group but hasn't applied for loan yet
    if (!loanApplication) {
      console.log('[HomeScreen] User in group but no loan application - navigating to loan orientation');
      router.push('/loans/orientation-1');
      return;
    }

    // If loan is pending approval
    if (loanApplication.status === 'pending') {
      console.log('[HomeScreen] Loan pending approval');
      Alert.alert(
        'Loan Under Review',
        'Your loan application is being reviewed. You will be notified once approved.',
        [{ text: 'OK' }]
      );
      return;
    }

    // If loan approved but no savings/insurance accounts
    if (loanApplication.status === 'approved' && (!savingsAccount || !insuranceAccount)) {
      console.log('[HomeScreen] Loan approved but missing savings/insurance - redirecting');
      Alert.alert(
        'Required Accounts',
        'You need to create savings and insurance accounts before loan disbursement.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Create Accounts', onPress: () => router.push('/loans/required-accounts') }
        ]
      );
      return;
    }

    // If everything is set up, show loan details
    console.log('[HomeScreen] All set up - showing loan details');
    Alert.alert(
      'Loan Active',
      `Your loan of ₱${loanApplication.amount.toLocaleString()} is active.\n\nNext payment: ${paymentSchedules.find(s => s.status === 'pending')?.dueDate.toLocaleDateString() || 'N/A'}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-[#009245] px-6 pt-6 pb-12 rounded-b-3xl">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-white/80 text-base">Welcome back,</Text>
              <View className="flex-row items-center">
                <Text className="text-white text-3xl font-bold">{user?.firstName || 'Maria'}</Text>
                <Text className="text-3xl ml-2">👋</Text>
              </View>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-full items-center justify-center relative">
              <Ionicons name="notifications" size={24} color="white" />
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 -mt-6">
          {/* Credit Balance / Pending Approval Card */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            {user?.isApproved && isLoanApproved ? (
              <>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="card" size={20} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-2">Credit Balance</Text>
                </View>
                <Text className="text-gray-900 text-4xl font-bold mb-4">₱15,000</Text>
                
                <View className="border-t border-gray-100 pt-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="calendar" size={16} color="#6B7280" />
                      <Text className="text-gray-500 text-sm ml-2">Next Payment</Text>
                    </View>
                    <View className="bg-amber-100 px-3 py-1 rounded-full flex-row items-center">
                      <Text className="text-amber-700 text-xs font-semibold mr-1">Due</Text>
                      <Text className="text-amber-700 text-lg">●</Text>
                    </View>
                  </View>
                  <Text className="text-gray-900 text-lg font-bold mt-1">Feb 24, 2026</Text>
                </View>
              </>
            ) : (
              <>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="time" size={20} color="#F59E0B" />
                  <Text className="text-gray-500 text-sm ml-2">Account Status</Text>
                </View>
                <Text className="text-gray-900 text-2xl font-bold mb-2">Pending Approval</Text>
                <Text className="text-gray-600 text-sm">
                  Your account is being reviewed. You'll be notified once approved.
                </Text>
              </>
            )}
          </View>

          {/* Apply for a Loan Button */}
          <TouchableOpacity
            onPress={handleLoanClick}
            disabled={!user?.isApproved || !userGroup}
            className={`py-4 rounded-xl mb-4 flex-row items-center justify-center ${
              user?.isApproved && userGroup ? 'bg-[#009245]' : 'bg-gray-300'
            }`}
          >
            <Ionicons name="trending-up" size={24} color="white" />
            <Text className="text-white text-lg font-bold ml-2">
              {!loanApplication ? 'Apply for a Loan' : 
               loanApplication.status === 'pending' ? 'Loan Under Review' :
               'View Loan Details'}
            </Text>
          </TouchableOpacity>

          {/* Savings and Insurance Cards */}
          <View className="flex-row mb-4">
            {/* Savings Balance */}
            <TouchableOpacity
              onPress={() => isLoanApproved ? router.push('/(tabs)/savings') : null}
              disabled={!isLoanApproved}
              className={`flex-1 rounded-2xl p-5 mr-2 shadow-sm ${
                isLoanApproved ? 'bg-white' : 'bg-gray-200'
              }`}
            >
              <View className="flex-row items-center mb-2">
                <Ionicons name="wallet" size={20} color={isLoanApproved ? '#10B981' : '#9CA3AF'} />
                <Text className={`text-sm ml-2 ${isLoanApproved ? 'text-gray-500' : 'text-gray-400'}`}>
                  Savings Balance
                </Text>
              </View>
              <Text className={`text-2xl font-bold mb-1 ${isLoanApproved ? 'text-gray-900' : 'text-gray-500'}`}>
                ₱{savingsBalance.toLocaleString()}
              </Text>
              <Text className={`text-xs ${isLoanApproved ? 'text-green-600' : 'text-gray-400'}`}>
                ↑ ₱{savingsThisWeek} this week
              </Text>
            </TouchableOpacity>

            {/* Insurance Status */}
            <TouchableOpacity
              onPress={() => isLoanApproved ? router.push('/microinsurance') : null}
              disabled={!isLoanApproved}
              className={`flex-1 rounded-2xl p-5 ml-2 shadow-sm ${
                isLoanApproved ? 'bg-white' : 'bg-gray-200'
              }`}
            >
              <View className="flex-row items-center mb-2">
                <Ionicons name="shield-checkmark" size={20} color={isLoanApproved ? '#3B82F6' : '#9CA3AF'} />
                <Text className={`text-sm ml-2 ${isLoanApproved ? 'text-gray-500' : 'text-gray-400'}`}>
                  Insurance Status
                </Text>
              </View>
              <View className={`px-3 py-1.5 rounded-full self-start ${
                isLoanApproved ? 'bg-green-100' : 'bg-gray-300'
              }`}>
                <View className="flex-row items-center">
                  <Ionicons 
                    name="checkmark-circle" 
                    size={16} 
                    color={isLoanApproved ? '#10B981' : '#9CA3AF'} 
                  />
                  <Text className={`text-sm font-semibold ml-1 ${
                    isLoanApproved ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {isLoanApproved ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Quick Access */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-gray-500 text-sm font-semibold uppercase mb-4">QUICK ACCESS</Text>
            
            <View className="flex-row justify-between">
              {/* How to Apply for a Loan */}
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/services')}
                className="items-center flex-1"
              >
                <View className="w-16 h-16 bg-teal-100 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="book" size={28} color="#14B8A6" />
                </View>
                <Text className="text-gray-900 text-xs font-semibold text-center">
                  How to Apply{'\n'}for a Loan
                </Text>
              </TouchableOpacity>

              {/* Savings */}
              <TouchableOpacity
                onPress={() => isLoanApproved ? router.push('/(tabs)/savings') : null}
                disabled={!isLoanApproved}
                className="items-center flex-1"
              >
                <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-2 ${
                  isLoanApproved ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  <Ionicons name="wallet" size={28} color={isLoanApproved ? '#10B981' : '#9CA3AF'} />
                </View>
                <Text className={`text-xs font-semibold text-center ${
                  isLoanApproved ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  Savings
                </Text>
              </TouchableOpacity>

              {/* Insurance */}
              <TouchableOpacity
                onPress={() => isLoanApproved ? router.push('/microinsurance') : null}
                disabled={!isLoanApproved}
                className="items-center flex-1"
              >
                <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-2 ${
                  isLoanApproved ? 'bg-amber-100' : 'bg-gray-200'
                }`}>
                  <Ionicons name="shield-checkmark" size={28} color={isLoanApproved ? '#F59E0B' : '#9CA3AF'} />
                </View>
                <Text className={`text-xs font-semibold text-center ${
                  isLoanApproved ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  Insurance
                </Text>
              </TouchableOpacity>

              {/* Group */}
              <TouchableOpacity
                onPress={() => user?.isApproved ? router.push('/(tabs)/center') : null}
                disabled={!user?.isApproved}
                className="items-center flex-1"
              >
                <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-2 ${
                  user?.isApproved ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                  <Ionicons name="people" size={28} color={user?.isApproved ? '#3B82F6' : '#9CA3AF'} />
                </View>
                <Text className={`text-xs font-semibold text-center ${
                  user?.isApproved ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  Center
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Banner */}
          <View className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-4 flex-row items-start">
            <Text className="text-2xl mr-3">💡</Text>
            <Text className="flex-1 text-teal-900 text-sm">
              Part of your loan goes to savings and insurance for your protection.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
