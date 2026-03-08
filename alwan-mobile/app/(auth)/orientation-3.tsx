import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Orientation3Screen() {
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
          <View className="w-32 h-32 bg-green-100 rounded-full items-center justify-center mb-8">
            <Ionicons name="cash" size={64} color="#009245" />
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Your Microfinance Journey
          </Text>
          
          <View className="w-full px-4 space-y-4">
            <View className="flex-row items-start mb-4">
              <View className="w-8 h-8 bg-[#009245] rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">Start Saving</Text>
                <Text className="text-sm text-gray-600">Open a savings account and build your financial foundation</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-4">
              <View className="w-8 h-8 bg-[#009245] rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">Access Loans</Text>
                <Text className="text-sm text-gray-600">Apply for microloans to grow your business or meet family needs</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-4">
              <View className="w-8 h-8 bg-[#009245] rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">Grow Together</Text>
                <Text className="text-sm text-gray-600">Join community meetings and financial literacy programs</Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-[#009245] rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">4</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">Achieve Goals</Text>
                <Text className="text-sm text-gray-600">Build a better future for your family through financial empowerment</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Navigation */}
        <View className="pb-8">
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            className="bg-[#009245] py-4 rounded-xl"
          >
            <Text className="text-white text-center text-base font-semibold">Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
