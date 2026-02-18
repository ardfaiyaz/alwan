import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LoanOrientation3Screen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        {/* Progress */}
        <View className="flex-row mb-8">
          <View className="flex-1 h-1 bg-[#009245] rounded-full mr-2" />
          <View className="flex-1 h-1 bg-[#009245] rounded-full mr-2" />
          <View className="flex-1 h-1 bg-[#009245] rounded-full" />
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-center">
          <View className="w-32 h-32 bg-purple-100 rounded-full items-center justify-center mb-8">
            <Ionicons name="calendar" size={64} color="#8B5CF6" />
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Weekly Payments
          </Text>
          
          <Text className="text-base text-gray-600 text-center px-4 leading-6">
            Repay your loan in small weekly amounts that fit your budget. Build your credit history with on-time payments.
          </Text>
        </View>

        {/* Navigation */}
        <View className="pb-8">
          <TouchableOpacity
            onPress={() => router.push('/loans/select-type')}
            className="bg-[#009245] py-4 rounded-xl"
          >
            <Text className="text-white text-center text-base font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
