import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LoanOrientation1Screen() {
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
            <Ionicons name="cash" size={64} color="#009245" />
          </View>

          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Microloans for Mothers
          </Text>
          
          <Text className="text-base text-gray-600 text-center px-4 leading-6">
            KMBI provides small loans to help mothers start or grow their businesses and support their families.
          </Text>
        </View>

        {/* Navigation */}
        <View className="pb-8">
          <TouchableOpacity
            onPress={() => router.push('/loans/orientation-2')}
            className="bg-[#009245] py-4 rounded-xl"
          >
            <Text className="text-white text-center text-base font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
