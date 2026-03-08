import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Orientation1Screen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        {/* Progress */}
        <View className="flex-row mb-8">
          <View className="flex-1 h-1 bg-[#009245] rounded-full mr-2" />
          <View className="flex-1 h-1 bg-gray-200 rounded-full mr-2" />
          <View className="flex-1 h-1 bg-gray-200 rounded-full" />
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-center">
          <View className="w-32 h-32 bg-green-100 rounded-full items-center justify-center mb-8">
            <Ionicons name="people" size={64} color="#009245" />
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Welcome to KMBI
          </Text>
          
          <Text className="text-base text-gray-600 text-center px-4 leading-6">
            Kabalikat ng Mamamayan sa Barangay, Inc. is a microfinance institution empowering mothers through savings, loans, and financial literacy programs.
          </Text>
          
          <View className="mt-8 w-full px-4">
            <View className="bg-green-50 p-4 rounded-xl mb-3">
              <Text className="text-sm font-semibold text-gray-900 mb-1">💰 Savings Programs</Text>
              <Text className="text-xs text-gray-600">Build your financial security with our savings plans</Text>
            </View>
            <View className="bg-green-50 p-4 rounded-xl mb-3">
              <Text className="text-sm font-semibold text-gray-900 mb-1">🤝 Microloans</Text>
              <Text className="text-xs text-gray-600">Access affordable loans for your business needs</Text>
            </View>
            <View className="bg-green-50 p-4 rounded-xl">
              <Text className="text-sm font-semibold text-gray-900 mb-1">📚 Financial Education</Text>
              <Text className="text-xs text-gray-600">Learn money management and business skills</Text>
            </View>
          </View>
        </View>

        {/* Navigation */}
        <View className="pb-8">
          <TouchableOpacity
            onPress={() => router.push('/(auth)/orientation-2')}
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
