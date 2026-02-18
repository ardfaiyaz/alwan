import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function ApplyConfirmationScreen() {
  const router = useRouter();
  const { submitLoanApplication } = useAuth();
  const [loanData] = useState({
    amount: 5000,
    term: 20,
    loanType: 'Business Capital'
  });

  const handleSubmit = () => {
    console.log('[ApplyConfirmation] ========== SUBMIT APPLICATION CLICKED ==========');
    console.log('[ApplyConfirmation] Submitting loan application');
    console.log('[ApplyConfirmation] Amount:', loanData.amount, 'Term:', loanData.term, 'Type:', loanData.loanType);
    
    submitLoanApplication(loanData.amount, loanData.term, loanData.loanType);
    
    console.log('[ApplyConfirmation] Loan application submitted');
    console.log('[ApplyConfirmation] Redirecting to homepage...');
    
    router.replace('/(tabs)');
    
    console.log('[ApplyConfirmation] Navigation command executed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Confirm Application</Text>
          <Text className="text-sm text-gray-600 mt-2">
            Review your loan application details
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Application Summary */}
          <View className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="document-text" size={24} color="#009245" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">Loan Application</Text>
                <Text className="text-xs text-green-700">Ready to Submit</Text>
              </View>
            </View>
            
            <View className="border-t border-green-200 pt-3 mt-2">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-700">Loan Amount:</Text>
                <Text className="font-bold text-gray-900">₱{loanData.amount.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-700">Loan Term:</Text>
                <Text className="font-bold text-gray-900">{loanData.term} weeks</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-700">Loan Type:</Text>
                <Text className="font-bold text-gray-900">{loanData.loanType}</Text>
              </View>
            </View>
          </View>

          {/* What Happens Next */}
          <Text className="text-lg font-bold text-gray-900 mb-3">
            What Happens Next?
          </Text>

          <View className="space-y-3 mb-6">
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-blue-700 font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold mb-1">
                  Application Review
                </Text>
                <Text className="text-gray-600 text-sm">
                  Your application will be reviewed by KMBI staff within 1-2 business days
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-blue-700 font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold mb-1">
                  Approval Notification
                </Text>
                <Text className="text-gray-600 text-sm">
                  You'll receive a notification once your loan is approved
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-blue-700 font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold mb-1">
                  Create Required Accounts
                </Text>
                <Text className="text-gray-600 text-sm">
                  Set up your savings and insurance accounts for protection
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-blue-700 font-bold">4</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold mb-1">
                  Loan Disbursement
                </Text>
                <Text className="text-gray-600 text-sm">
                  Receive your loan amount and start your weekly payments
                </Text>
              </View>
            </View>
          </View>

          {/* Important Reminders */}
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#F59E0B" />
              <View className="flex-1 ml-3">
                <Text className="text-amber-900 font-semibold mb-2">
                  Important Reminders
                </Text>
                <Text className="text-amber-800 text-sm mb-2">
                  • Attend all weekly center meetings
                </Text>
                <Text className="text-amber-800 text-sm mb-2">
                  • Make timely weekly payments
                </Text>
                <Text className="text-amber-800 text-sm mb-2">
                  • Part of your loan goes to savings and insurance
                </Text>
                <Text className="text-amber-800 text-sm">
                  • Support your fellow group members
                </Text>
              </View>
            </View>
          </View>

          {/* Terms Agreement */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-gray-700 text-sm leading-6 mb-2">
              By submitting this application, you agree to:
            </Text>
            <Text className="text-gray-600 text-xs leading-5 mb-1">
              • KMBI's terms and conditions
            </Text>
            <Text className="text-gray-600 text-xs leading-5 mb-1">
              • The solidarity lending model and mutual guarantee system
            </Text>
            <Text className="text-gray-600 text-xs leading-5 mb-1">
              • Weekly payment obligations
            </Text>
            <Text className="text-gray-600 text-xs leading-5">
              • Participation in financial literacy programs
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#009245] py-4 rounded-xl mb-4"
          >
            <Text className="text-white text-center text-base font-semibold">
              Submit Application
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-200 py-4 rounded-xl"
          >
            <Text className="text-gray-700 text-center text-base font-semibold">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
