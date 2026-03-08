import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function GroupOptionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Choose Group Option</Text>
          <Text className="text-sm text-gray-600 mt-2">
            KMBI uses a group-based lending model for mutual support
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Info Card */}
          <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#009245" />
              <View className="flex-1 ml-3">
                <Text className="text-green-900 font-semibold mb-2">
                  About Group Lending
                </Text>
                <Text className="text-green-800 text-sm">
                  KMBI's group lending model promotes mutual support and accountability. Members meet regularly to support each other's financial goals.
                </Text>
              </View>
            </View>
          </View>

          {/* Create Group Option */}
          <TouchableOpacity
            onPress={() => {
              // TODO: Navigate to create group flow
              router.push('/loans/create-group');
            }}
            className="bg-white border-2 border-[#009245] rounded-2xl p-6 mb-4"
          >
            <View className="items-center">
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="people" size={40} color="#009245" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Create a Group
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-4">
                Start a new lending group and invite other members to join
              </Text>
              <View className="bg-green-50 px-4 py-2 rounded-full">
                <Text className="text-[#009245] font-semibold text-sm">
                  Requires 2-15 members
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Join Group Option */}
          <TouchableOpacity
            onPress={() => {
              // TODO: Navigate to join group flow
              router.push('/loans/join-group');
            }}
            className="bg-white border-2 border-blue-500 rounded-2xl p-6"
          >
            <View className="items-center">
              <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="person-add" size={40} color="#3B82F6" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Join a Group
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-4">
                Join an existing lending group in your community
              </Text>
              <View className="bg-blue-50 px-4 py-2 rounded-full">
                <Text className="text-blue-600 font-semibold text-sm">
                  Browse available groups
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Benefits Section */}
          <View className="mt-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Group Benefits
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-start bg-gray-50 p-4 rounded-xl">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="shield-checkmark" size={18} color="#009245" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-1">
                    Mutual Support
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Members support each other through regular meetings and shared experiences
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start bg-gray-50 p-4 rounded-xl">
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="trending-up" size={18} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-1">
                    Better Terms
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Group members may qualify for better loan terms and rates
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start bg-gray-50 p-4 rounded-xl">
                <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="school" size={18} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-1">
                    Financial Education
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Access to group training and financial literacy programs
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
