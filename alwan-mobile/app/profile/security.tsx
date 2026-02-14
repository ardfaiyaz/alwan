import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SecurityScreen() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Purple Header */}
      <View className="bg-purple-600 pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Security</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Card */}
      <View className="flex-1 bg-white rounded-t-[40px] -mt-6 px-6 pt-8">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-gray-800 text-lg font-semibold mb-4">Security</Text>

          <TouchableOpacity
            onPress={() => router.push('/profile/change-pin')}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
          >
            <Text className="text-gray-800 text-base">Change Pin</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/profile/fingerprint')}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
          >
            <Text className="text-gray-800 text-base">Fingerprint</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/profile/terms')}
            className="flex-row items-center justify-between py-4"
          >
            <Text className="text-gray-800 text-base">Terms and Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
