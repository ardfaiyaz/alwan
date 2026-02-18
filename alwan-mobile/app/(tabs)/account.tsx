import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function AccountScreen() {
  const { user, approveSignup, approveLoanType, userGroup } = useAuth();

  console.log('[AccountScreen] Rendering with user:', {
    isApproved: user?.isApproved,
    hasSubmittedLoanType: user?.hasSubmittedLoanType,
    loanTypeApproved: user?.loanTypeApproved,
    hasGroup: !!userGroup,
    groupName: userGroup?.name,
  });

  const handleSignupApproval = () => {
    console.log('[AccountScreen] handleSignupApproval clicked');
    console.log('[AccountScreen] Current user before approval:', user);
    
    approveSignup();
    console.log('[AccountScreen] approveSignup() called directly');
    
    Alert.alert('Success', 'Account approved! Go to Home tab to see changes.');
  };

  const handleLoanTypeApproval = () => {
    console.log('[AccountScreen] handleLoanTypeApproval clicked');
    console.log('[AccountScreen] Current user:', user);
    console.log('[AccountScreen] hasSubmittedLoanType:', user?.hasSubmittedLoanType);
    
    if (!user?.hasSubmittedLoanType) {
      console.log('[AccountScreen] User has not submitted loan type - showing error');
      Alert.alert('Error', 'User has not submitted loan type documents yet.');
      return;
    }

    console.log('[AccountScreen] Calling approveLoanType()');
    approveLoanType();
    console.log('[AccountScreen] approveLoanType() called directly');
    
    Alert.alert('Success', 'Loan type approved! User can now proceed to group selection.');
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
                <View className={`w-3 h-3 rounded-full mr-3 ${user?.hasSubmittedLoanType ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <View>
                  <Text className="font-semibold text-gray-900">Loan Documents</Text>
                  <Text className="text-sm text-gray-600">
                    {user?.hasSubmittedLoanType ? 'Submitted' : 'Not Submitted'}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name={user?.hasSubmittedLoanType ? 'document-text' : 'document-outline'} 
                size={24} 
                color={user?.hasSubmittedLoanType ? '#3B82F6' : '#9CA3AF'} 
              />
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-3 ${user?.loanTypeApproved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <View>
                  <Text className="font-semibold text-gray-900">Loan Type Status</Text>
                  <Text className="text-sm text-gray-600">
                    {user?.loanTypeApproved ? 'Approved ✓' : 'Pending'}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name={user?.loanTypeApproved ? 'checkmark-circle' : 'time'} 
                size={24} 
                color={user?.loanTypeApproved ? '#10B981' : '#F59E0B'} 
              />
            </View>
          </View>

          {/* Group Status */}
          {userGroup && (
            <View className="bg-white rounded-xl p-4 mb-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full mr-3 bg-purple-500" />
                  <View>
                    <Text className="font-semibold text-gray-900">Solidarity Group</Text>
                    <Text className="text-sm text-gray-600">
                      {userGroup.name} ({userGroup.members.length}/{userGroup.maxMembers} members)
                    </Text>
                  </View>
                </View>
                <Ionicons name="people" size={24} color="#9333EA" />
              </View>
            </View>
          )}

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
            onPress={handleLoanTypeApproval}
            disabled={!user?.hasSubmittedLoanType || user?.loanTypeApproved}
            className={`py-4 rounded-xl mb-6 ${
              !user?.hasSubmittedLoanType || user?.loanTypeApproved ? 'bg-gray-300' : 'bg-blue-600'
            }`}
          >
            <Text className="text-white text-center text-base font-semibold">
              {user?.loanTypeApproved ? '✓ Loan Type Approved' : 'Approve Loan Type'}
            </Text>
          </TouchableOpacity>

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
