import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Orientation2Screen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        {/* Progress */}
        <View className="flex-row mb-8">
          <View className="flex-1 h-1 bg-[#009245] rounded-full mr-2" />
          <View className="flex-1 h-1 bg-[#009245] rounded-full mr-2" />
          <View className="flex-1 h-1 bg-gray-200 rounded-full" />
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-center">
          <View className="w-32 h-32 bg-green-100 rounded-full items-center justify-center mb-8">
            <Ionicons name="shield-checkmark" size={64} color="#009245" />
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Membership Verification
          </Text>
          
          <Text className="text-base text-gray-600 text-center px-4 leading-6">
            Your membership application is pending approval. Our team will verify your documents to ensure you meet the requirements for KMBI membership.
          </Text>

          <View className="mt-6 w-full px-4">
            <View className="bg-blue-50 p-4 rounded-xl mb-3">
              <Text className="text-sm font-semibold text-gray-900 mb-1">📋 Document Review</Text>
              <Text className="text-xs text-gray-600">We verify your identity and eligibility</Text>
            </View>
            <View className="bg-blue-50 p-4 rounded-xl mb-3">
              <Text className="text-sm font-semibold text-gray-900 mb-1">⏱️ Processing Time</Text>
              <Text className="text-xs text-gray-600">Usually takes 1-2 business days</Text>
            </View>
            <View className="bg-blue-50 p-4 rounded-xl">
              <Text className="text-sm font-semibold text-gray-900 mb-1">🔔 Notification</Text>
              <Text className="text-xs text-gray-600">You'll be notified once approved</Text>
            </View>
          </View>
        </View>

        {/* Navigation */}
        <View className="pb-8">
          <TouchableOpacity
            onPress={() => router.push('/(auth)/orientation-3')}
            className="bg-[#009245] py-4 rounded-xl mb-4"
          >
            <Text className="text-white text-center text-base font-semibold">Next</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
            <Text className="text-gray-600 text-center">Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
