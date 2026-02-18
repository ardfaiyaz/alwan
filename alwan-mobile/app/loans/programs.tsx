import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function ProgramsScreen() {
  const router = useRouter();
  const { updateUser } = useAuth();

  const handleSubmit = () => {
    console.log('[Programs] ========== SUBMIT APPLICATION CLICKED ==========');
    console.log('[Programs] Submitting loan application');
    console.log('[Programs] Updating user hasSubmittedLoanType to true');
    
    updateUser({ hasSubmittedLoanType: true });
    
    console.log('[Programs] User updated');
    console.log('[Programs] Redirecting to homepage...');
    
    // Redirect immediately without alert
    router.replace('/(tabs)/');
    
    console.log('[Programs] Navigation command executed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">KMBI Programs</Text>
          <Text className="text-sm text-gray-600 mt-2">
            Our microfinance services for mothers
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Main Program */}
          <View className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="cash" size={24} color="#009245" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">Microloan Program</Text>
                <Text className="text-xs text-green-700">Core Service</Text>
              </View>
            </View>
            <Text className="text-sm text-gray-700 leading-5">
              Small loans from ₱3,000 to ₱50,000 for business capital, education, medical needs, or home improvements. Weekly payment terms with group support.
            </Text>
          </View>

          {/* Additional Services */}
          <Text className="text-base font-bold text-gray-900 mb-3">
            Additional Services
          </Text>

          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="wallet" size={20} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">Savings Program</Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Build your savings with weekly deposits. Earn interest and create financial security for your family.
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="school" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">Financial Literacy</Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Free training on budgeting, saving, and business management. Learn skills to grow your income.
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="people" size={20} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">Group Meetings</Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Weekly center meetings for payments, support, and community building. Connect with other mothers.
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">Microinsurance</Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Optional insurance coverage for life, health, and property protection for you and your family.
                </Text>
              </View>
            </View>
          </View>

          {/* Benefits */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="font-semibold text-gray-900 mb-3">Why Choose KMBI?</Text>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={20} color="#009245" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  No collateral required
                </Text>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={20} color="#009245" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  Flexible payment terms
                </Text>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={20} color="#009245" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  Community support system
                </Text>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={20} color="#009245" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  Financial education included
                </Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#009245] py-4 rounded-xl"
          >
            <Text className="text-white text-center text-base font-semibold">
              Submit Application
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
