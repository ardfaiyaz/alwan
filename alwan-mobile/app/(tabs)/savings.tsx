import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function SavingsScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-[#009245] px-6 pt-6 pb-8 rounded-b-3xl">
          <Text className="text-white text-2xl font-bold mb-2">Savings</Text>
          <Text className="text-white/80 text-sm">Manage your savings accounts</Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {!user?.isApproved ? (
            <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 items-center">
              <Ionicons name="lock-closed" size={48} color="#D97706" />
              <Text className="text-yellow-900 font-semibold mt-4 mb-2">
                Account Pending Approval
              </Text>
              <Text className="text-yellow-800 text-sm text-center">
                Savings features will be available once your account is approved.
              </Text>
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-6 items-center">
              <Ionicons name="wallet" size={64} color="#8B5CF6" />
              <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">
                Savings Coming Soon
              </Text>
              <Text className="text-gray-600 text-center">
                Savings account features will be implemented in the next phase.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
