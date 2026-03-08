import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function AccountScreen() {
  const router = useRouter();
  const { user, approveSignup, userGroup, loanApplication, approveLoan, savingsAccount, insuranceAccount, paymentSchedules, toggleOverduePayments } = useAuth();

  console.log('[AccountScreen] Rendering with user:', {
    isApproved: user?.isApproved,
    hasGroup: !!userGroup,
    groupName: userGroup?.name,
    hasLoan: !!loanApplication,
    loanStatus: loanApplication?.status,
    hasSavings: !!savingsAccount,
    hasInsurance: !!insuranceAccount,
  });

  const handleSignupApproval = () => {
    console.log('[AccountScreen] handleSignupApproval clicked');
    console.log('[AccountScreen] Current user before approval:', user);
    
    approveSignup();
    console.log('[AccountScreen] approveSignup() called directly');
    
    Alert.alert('Success', 'Account approved! User can now join/create groups.');
  };

  const handleLoanApproval = () => {
    console.log('[AccountScreen] handleLoanApproval clicked');
    console.log('[AccountScreen] Current loan:', loanApplication);
    
    if (!loanApplication) {
      console.log('[AccountScreen] No loan application to approve');
      Alert.alert('Error', 'No loan application found.');
      return;
    }

    if (loanApplication.status !== 'pending') {
      console.log('[AccountScreen] Loan already processed');
      Alert.alert('Error', 'Loan has already been processed.');
      return;
    }

    console.log('[AccountScreen] Calling approveLoan()');
    approveLoan();
    console.log('[AccountScreen] approveLoan() called - loan approved and payment schedules created');
    
    Alert.alert('Success', 'Loan approved! User must now create savings and insurance accounts.');
  };

  const handleToggleOverdue = () => {
    console.log('[AccountScreen] handleToggleOverdue clicked');
    
    if (!paymentSchedules || paymentSchedules.length === 0) {
      Alert.alert('Error', 'No payment schedules found.');
      return;
    }

    const hasOverdue = paymentSchedules.some(s => s.status === 'overdue');
    toggleOverduePayments();
    
    Alert.alert(
      'Success', 
      hasOverdue 
        ? 'All overdue payments reverted to pending status.' 
        : 'All pending payments set to overdue status.'
    );
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="person-circle-outline" size={80} color="#9CA3AF" />
          <Text className="text-xl font-bold text-gray-900 mt-4">No User Found</Text>
          <Text className="text-gray-600 text-center mt-2">
            Please log in or sign up to access your account.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-[#009245] px-6 pt-6 pb-8 rounded-b-3xl">
          <View className="items-center">
            <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={50} color="white" />
            </View>
            <Text className="text-white text-2xl font-bold">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-white/80 text-sm mt-1">{user?.phoneNumber}</Text>
          </View>
        </View>

        {/* Account Status */}
        <View className="px-6 py-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Account Status</Text>
          
          <View className="bg-white rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-3 ${user?.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <View>
                  <Text className="font-semibold text-gray-900">Membership Status</Text>
                  <Text className="text-sm text-gray-600">
                    {user?.isApproved ? 'Approved ✓' : 'Pending Approval'}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name={user?.isApproved ? 'checkmark-circle' : 'time'} 
                size={24} 
                color={user?.isApproved ? '#10B981' : '#F59E0B'} 
              />
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-3 ${userGroup ? 'bg-purple-500' : 'bg-gray-300'}`} />
                <View>
                  <Text className="font-semibold text-gray-900">Group Membership</Text>
                  <Text className="text-sm text-gray-600">
                    {userGroup ? `${userGroup.name} ✓` : 'Not in a group'}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name={userGroup ? 'people' : 'people-outline'} 
                size={24} 
                color={userGroup ? '#9333EA' : '#9CA3AF'} 
              />
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-3 ${
                  loanApplication?.status === 'approved' ? 'bg-green-500' :
                  loanApplication?.status === 'pending' ? 'bg-yellow-500' :
                  'bg-gray-300'
                }`} />
                <View>
                  <Text className="font-semibold text-gray-900">Loan Status</Text>
                  <Text className="text-sm text-gray-600">
                    {loanApplication ? 
                      `${loanApplication.status.charAt(0).toUpperCase() + loanApplication.status.slice(1)} - ₱${loanApplication.amount.toLocaleString()}` : 
                      'No loan application'
                    }
                  </Text>
                </View>
              </View>
              <Ionicons 
                name={loanApplication?.status === 'approved' ? 'checkmark-circle' : 'cash-outline'} 
                size={24} 
                color={loanApplication?.status === 'approved' ? '#10B981' : '#9CA3AF'} 
              />
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-3 ${savingsAccount ? 'bg-purple-500' : 'bg-gray-300'}`} />
                <View>
                  <Text className="font-semibold text-gray-900">Savings Account</Text>
                  <Text className="text-sm text-gray-600">
                    {savingsAccount ? `Active - ₱${savingsAccount.balance.toFixed(2)}` : 'Not created'}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name={savingsAccount ? 'wallet' : 'wallet-outline'} 
                size={24} 
                color={savingsAccount ? '#8B5CF6' : '#9CA3AF'} 
              />
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-3 ${insuranceAccount ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                <View>
                  <Text className="font-semibold text-gray-900">Insurance Account</Text>
                  <Text className="text-sm text-gray-600">
                    {insuranceAccount ? `${insuranceAccount.plan} ✓` : 'Not created'}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name={insuranceAccount ? 'shield-checkmark' : 'shield-outline'} 
                size={24} 
                color={insuranceAccount ? '#F59E0B' : '#9CA3AF'} 
              />
            </View>
          </View>

          {/* Test Buttons */}
          <Text className="text-lg font-bold text-gray-900 mb-4">Admin Controls (Testing)</Text>
          
          <TouchableOpacity
            onPress={handleSignupApproval}
            disabled={user?.isApproved}
            className={`py-4 rounded-xl mb-3 ${user?.isApproved ? 'bg-gray-300' : 'bg-[#009245]'}`}
          >
            <Text className="text-white text-center text-base font-semibold">
              {user?.isApproved ? '✓ Signup Approved' : 'Approve Signup'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLoanApproval}
            disabled={!loanApplication || loanApplication.status !== 'pending'}
            className={`py-4 rounded-xl mb-3 ${
              loanApplication?.status === 'pending' ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <Text className="text-white text-center text-base font-semibold">
              {loanApplication?.status === 'approved' ? '✓ Loan Approved' : 
               loanApplication?.status === 'pending' ? 'Approve Loan' : 
               'No Loan to Approve'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleOverdue}
            disabled={!paymentSchedules || paymentSchedules.length === 0}
            className={`py-4 rounded-xl mb-3 ${
              paymentSchedules && paymentSchedules.length > 0 ? 'bg-red-600' : 'bg-gray-300'
            }`}
          >
            <Text className="text-white text-center text-base font-semibold">
              {paymentSchedules?.some(s => s.status === 'overdue') 
                ? '↻ Revert Overdue to Pending' 
                : '⚠ Set Payments to Overdue'}
            </Text>
          </TouchableOpacity>

          {/* Open Required Accounts Button */}
          {loanApplication?.status === 'approved' && (!savingsAccount || !insuranceAccount) && (
            <TouchableOpacity
              onPress={() => {
                console.log('[AccountScreen] Navigating to required accounts page');
                router.push('/loans/group-options' as any); // Will update route later
              }}
              className="bg-orange-600 py-4 rounded-xl mb-6"
            >
              <Text className="text-white text-center text-base font-semibold">
                Open Savings & Insurance Accounts
              </Text>
            </TouchableOpacity>
          )}

          {/* Menu Items */}
          <Text className="text-lg font-bold text-gray-900 mb-4">Settings</Text>
          
          <View className="bg-white rounded-xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={22} color="#047857" />
                <Text className="text-gray-700 font-medium ml-3">Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <Ionicons name="lock-closed-outline" size={22} color="#047857" />
                <Text className="text-gray-700 font-medium ml-3">Security</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <Ionicons name="help-circle-outline" size={22} color="#047857" />
                <Text className="text-gray-700 font-medium ml-3">Help Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
