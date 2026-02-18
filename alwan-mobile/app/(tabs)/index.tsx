import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user, userGroup, loanApplication, savingsAccount, insuranceAccount, paymentSchedules } = useAuth();

  console.log('[HomeScreen] Rendering with user:', {
    isApproved: user?.isApproved,
    hasGroup: !!userGroup,
    groupName: userGroup?.name,
    hasLoan: !!loanApplication,
    loanStatus: loanApplication?.status,
    hasSavings: !!savingsAccount,
    hasInsurance: !!insuranceAccount,
  });

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
      console.log('[HomeScreen] User has no group - must join/create group first');
      Alert.alert(
        'Join a Group First',
        'You need to join or create a solidarity group before applying for a loan. Groups provide mutual support and guarantee each other\'s loans.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join/Create Group', onPress: () => router.push('/loans/group-options') }
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
          { text: 'Create Accounts', onPress: () => router.push('/loans/group-options') } // Temporary route
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
        <View className="bg-[#009245] px-6 pt-6 pb-8 rounded-b-3xl">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-lg">Welcome back,</Text>
              <Text className="text-white text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Status Card */}
          <View className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/80 text-sm mb-1">Membership Status</Text>
                <View className="flex-row items-center">
                  <View className={`w-2 h-2 rounded-full mr-2 ${user?.isApproved ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <Text className="text-white text-lg font-semibold">
                    {user?.isApproved ? 'Active Member' : 'Pending Approval'}
                  </Text>
                </View>
              </View>
              <Ionicons name="information-circle-outline" size={24} color="white" />
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="px-6 py-6">
          {/* Pending Message */}
          {!user?.isApproved && (
            <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
              <View className="flex-row items-start">
                <Ionicons name="time-outline" size={24} color="#D97706" />
                <View className="flex-1 ml-3">
                  <Text className="text-yellow-900 font-semibold mb-1">Verification in Progress</Text>
                  <Text className="text-yellow-800 text-sm">
                    Our team is reviewing your documents. You'll be notified once approved.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Approved but No Group */}
          {user?.isApproved && !userGroup && (
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <View className="flex-row items-start">
                <Ionicons name="people-outline" size={24} color="#3B82F6" />
                <View className="flex-1 ml-3">
                  <Text className="text-blue-900 font-semibold mb-1">Join a Solidarity Group</Text>
                  <Text className="text-blue-800 text-sm mb-2">
                    Before applying for a loan, you need to join or create a solidarity group.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/loans/group-options')}
                    className="bg-blue-600 py-2 px-4 rounded-lg self-start"
                  >
                    <Text className="text-white text-sm font-semibold">Join/Create Group</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Group Information */}
          {userGroup && (
            <View className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-6">
              <View className="flex-row items-start">
                <Ionicons name="people" size={24} color="#9333EA" />
                <View className="flex-1 ml-3">
                  <Text className="text-purple-900 font-semibold mb-1">Your Solidarity Group</Text>
                  <Text className="text-purple-800 text-sm mb-1">
                    {userGroup.name}
                  </Text>
                  <Text className="text-purple-700 text-xs">
                    {userGroup.members.length}/{userGroup.maxMembers} members • {userGroup.meetingDay}s at {userGroup.meetingTime}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Loan Status */}
          {loanApplication && (
            <View className={`border-2 rounded-2xl p-4 mb-6 ${
              loanApplication.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
              loanApplication.status === 'approved' ? 'bg-green-50 border-green-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <View className="flex-row items-start">
                <Ionicons 
                  name={loanApplication.status === 'approved' ? 'checkmark-circle' : 'time-outline'} 
                  size={24} 
                  color={loanApplication.status === 'approved' ? '#10B981' : '#F59E0B'} 
                />
                <View className="flex-1 ml-3">
                  <Text className={`font-semibold mb-1 ${
                    loanApplication.status === 'approved' ? 'text-green-900' : 'text-yellow-900'
                  }`}>
                    Loan {loanApplication.status === 'approved' ? 'Approved' : 'Under Review'}
                  </Text>
                  <Text className={`text-sm ${
                    loanApplication.status === 'approved' ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    ₱{loanApplication.amount.toLocaleString()} • {loanApplication.term} weeks
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Required Accounts Alert */}
          {loanApplication?.status === 'approved' && (!savingsAccount || !insuranceAccount) && (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <View className="flex-row items-start">
                <Ionicons name="alert-circle" size={24} color="#DC2626" />
                <View className="flex-1 ml-3">
                  <Text className="text-red-900 font-semibold mb-1">Action Required</Text>
                  <Text className="text-red-800 text-sm mb-2">
                    You must open savings and insurance accounts before loan disbursement.
                  </Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert('Info', 'Please go to Account tab to approve your loan first.')}
                    className="bg-red-600 py-2 px-4 rounded-lg self-start"
                  >
                    <Text className="text-white text-sm font-semibold">Open Accounts</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Next Payment */}
          {loanApplication?.status === 'approved' && savingsAccount && insuranceAccount && paymentSchedules.length > 0 && (
            <View className="bg-white border-2 border-green-200 rounded-2xl p-4 mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-900 font-semibold">Next Payment</Text>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 text-xs font-semibold">
                    {paymentSchedules.filter(s => s.status === 'pending').length} pending
                  </Text>
                </View>
              </View>
              {paymentSchedules.find(s => s.status === 'pending') && (
                <>
                  <Text className="text-2xl font-bold text-gray-900 mb-1">
                    ₱{paymentSchedules.find(s => s.status === 'pending')?.amount.toFixed(2)}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Due: {paymentSchedules.find(s => s.status === 'pending')?.dueDate.toLocaleDateString()}
                  </Text>
                </>
              )}
            </View>
          )}

          {/* Main Services Grid */}
          <Text className="text-lg font-bold text-gray-900 mb-4">Services</Text>
          <View className="flex-row flex-wrap -mx-2 mb-6">
            <View className="w-1/2 px-2 mb-4">
              <TouchableOpacity 
                disabled={true}
                className="rounded-xl p-4 bg-gray-200"
              >
                <View className="w-12 h-12 rounded-full items-center justify-center mb-3 bg-gray-300">
                  <Ionicons name="wallet-outline" size={24} color="#9CA3AF" />
                </View>
                <Text className="font-semibold text-gray-500">Savings</Text>
                <Text className="text-xs text-gray-400">Coming soon</Text>
              </TouchableOpacity>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <TouchableOpacity 
                onPress={handleLoanClick}
                disabled={!user?.isApproved}
                className={`rounded-xl p-4 ${user?.isApproved ? 'bg-white' : 'bg-gray-200'}`}
              >
                <View className={`w-12 h-12 rounded-full items-center justify-center mb-3 ${user?.isApproved ? 'bg-green-100' : 'bg-gray-300'}`}>
                  <Ionicons name="cash-outline" size={24} color={user?.isApproved ? '#10B981' : '#9CA3AF'} />
                </View>
                <Text className={`font-semibold ${user?.isApproved ? 'text-gray-900' : 'text-gray-500'}`}>Loans</Text>
                <Text className={`text-xs ${user?.isApproved ? 'text-gray-600' : 'text-gray-400'}`}>Apply for loan</Text>
              </TouchableOpacity>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <TouchableOpacity 
                disabled={true}
                className="rounded-xl p-4 bg-gray-200"
              >
                <View className="w-12 h-12 rounded-full items-center justify-center mb-3 bg-gray-300">
                  <Ionicons name="card-outline" size={24} color="#9CA3AF" />
                </View>
                <Text className="font-semibold text-gray-500">Payments</Text>
                <Text className="text-xs text-gray-400">Coming soon</Text>
              </TouchableOpacity>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <TouchableOpacity 
                disabled={true}
                className="rounded-xl p-4 bg-gray-200"
              >
                <View className="w-12 h-12 rounded-full items-center justify-center mb-3 bg-gray-300">
                  <Ionicons name="school-outline" size={24} color="#9CA3AF" />
                </View>
                <Text className="font-semibold text-gray-500">Education</Text>
                <Text className="text-xs text-gray-400">Coming soon</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Community Section */}
          <Text className="text-lg font-bold text-gray-900 mb-4">Community</Text>
          <View className="bg-gray-200 rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 bg-gray-300 rounded-full items-center justify-center mr-3">
                <Ionicons name="people-outline" size={24} color="#9CA3AF" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-500">Group Meetings</Text>
                <Text className="text-xs text-gray-400">Coming soon</Text>
              </View>
            </View>
          </View>

          <View className="bg-gray-200 rounded-xl p-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-gray-300 rounded-full items-center justify-center mr-3">
                <Ionicons name="help-circle-outline" size={24} color="#9CA3AF" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-500">Support Center</Text>
                <Text className="text-xs text-gray-400">Coming soon</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
