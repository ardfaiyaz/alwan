import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CreateGroupScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View className="flex-1 items-center justify-center">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="people" size={60} color="#009245" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-3">Create Group</Text>
          <Text className="text-center text-gray-600 px-8">
            This feature will be implemented next. You'll be able to create a lending group and invite members.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
