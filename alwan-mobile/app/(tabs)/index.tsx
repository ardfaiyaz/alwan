import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  console.log('[HomeScreen] Rendering with user:', {
    isApproved: user?.isApproved,
    hasSubmittedLoanType: user?.hasSubmittedLoanType,
    loanTypeApproved: user?.loanTypeApproved,
  });

  const handleLoanClick = () => {
    console.log('[HomeScreen] handleLoanClick called');
    console.log('[HomeScreen] User state:', {
      isApproved: user?.isApproved,
      hasSubmittedLoanType: user?.hasSubmittedLoanType,
      loanTypeApproved: user?.loanTypeApproved,
    });

    if (!user?.isApproved) {
      console.log('[HomeScreen] User not approved - showing alert');
      Alert.alert(
        'Account Pending',
        'Your membership is still pending approval. Please wait for admin verification.',
        [{ text: 'OK' }]
      );
      return;
    }

    // If approved but hasn't submitted loan type yet
    if (!user?.hasSubmittedLoanType) {
      console.log('[HomeScreen] User approved but no loan type submitted - navigating to loan orientation');
      router.push('/loans/orientation-1');
      return;
    }

    // If submitted but not approved yet
    if (!user?.loanTypeApproved) {
      console.log('[HomeScreen] Loan type submitted but not approved - showing alert');
      Alert.alert(
        'Loan Type Pending',
        'Your loan documents are being reviewed. Please wait for approval.',
        [{ text: 'OK' }]
      );
      return;
    }

    // If everything is approved, show group options
    console.log('[HomeScreen] Everything approved - navigating to group-options');
    router.push('/loans/group-options');
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

          {/* Approved Message */}
          {user?.isApproved && (
            <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <View className="flex-1 ml-3">
                  <Text className="text-green-900 font-semibold mb-1">Membership Approved!</Text>
                  <Text className="text-green-800 text-sm">
                    Your account is now active. You can access all KMBI services.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Loan Type Pending Message */}
          {user?.isApproved && user?.hasSubmittedLoanType && !user?.loanTypeApproved && (
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <View className="flex-row items-start">
                <Ionicons name="document-text-outline" size={24} color="#3B82F6" />
                <View className="flex-1 ml-3">
                  <Text className="text-blue-900 font-semibold mb-1">Loan Documents Under Review</Text>
                  <Text className="text-blue-800 text-sm">
                    Your loan type documents are being reviewed. You'll be notified once approved.
                  </Text>
                </View>
              </View>
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
