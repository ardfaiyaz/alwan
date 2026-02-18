import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function LoanCalculatorScreen() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(20); // weeks

  // KMBI typical rates (simplified for demo)
  const interestRate = 0.02; // 2% per week
  const totalInterest = loanAmount * interestRate * loanTerm;
  const totalRepayment = loanAmount + totalInterest;
  const weeklyPayment = totalRepayment / loanTerm;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Loan Calculator</Text>
          <Text className="text-sm text-gray-600 mt-2">
            Estimate your weekly payments
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Loan Amount with Slider */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Loan Amount
            </Text>
            <View className="flex-row items-center border-2 border-gray-300 rounded-xl px-4 py-3 mb-3">
              <Text className="text-lg font-bold text-gray-700 mr-2">₱</Text>
              <TextInput
                className="flex-1 text-lg font-semibold text-gray-900"
                keyboardType="numeric"
                value={loanAmount.toString()}
                onChangeText={(value) => {
                  const num = parseInt(value) || 0;
                  if (num >= 3000 && num <= 50000) {
                    setLoanAmount(num);
                  }
                }}
                placeholder="5000"
              />
            </View>
            
            {/* Amount Slider */}
            <View className="mb-2">
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={3000}
                maximumValue={50000}
                step={1000}
                value={loanAmount}
                onValueChange={setLoanAmount}
                minimumTrackTintColor="#009245"
                maximumTrackTintColor="#D1D5DB"
                thumbTintColor="#009245"
              />
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">₱3,000</Text>
                <Text className="text-xs text-gray-500">₱50,000</Text>
              </View>
            </View>
          </View>

          {/* Loan Term with Slider */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Loan Term (Weeks)
            </Text>
            <View className="flex-row items-center border-2 border-gray-300 rounded-xl px-4 py-3 mb-3">
              <TextInput
                className="flex-1 text-lg font-semibold text-gray-900"
                keyboardType="numeric"
                value={loanTerm.toString()}
                onChangeText={(value) => {
                  const num = parseInt(value) || 0;
                  if (num >= 10 && num <= 50) {
                    setLoanTerm(num);
                  }
                }}
                placeholder="20"
              />
              <Text className="text-lg font-bold text-gray-700 ml-2">weeks</Text>
            </View>
            
            {/* Term Slider */}
            <View className="mb-2">
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={10}
                maximumValue={50}
                step={1}
                value={loanTerm}
                onValueChange={setLoanTerm}
                minimumTrackTintColor="#009245"
                maximumTrackTintColor="#D1D5DB"
                thumbTintColor="#009245"
              />
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">10 weeks</Text>
                <Text className="text-xs text-gray-500">50 weeks</Text>
              </View>
            </View>
          </View>

          {/* Results */}
          <View className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
            <Text className="text-sm text-green-800 mb-4 text-center">
              Estimated Payment Breakdown
            </Text>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-2 border-b border-green-200">
                <Text className="text-gray-700">Weekly Payment</Text>
                <Text className="text-2xl font-bold text-[#009245]">
                  ₱{weeklyPayment.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2">
                <Text className="text-gray-700">Principal Amount</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  ₱{loanAmount.toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2">
                <Text className="text-gray-700">Total Interest</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  ₱{totalInterest.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-t-2 border-green-300 pt-3">
                <Text className="text-gray-900 font-bold">Total Repayment</Text>
                <Text className="text-xl font-bold text-gray-900">
                  ₱{totalRepayment.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Info */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <View className="flex-1 ml-3">
                <Text className="text-sm text-blue-900">
                  This is an estimate. Actual rates may vary based on your loan type and group. Final terms will be confirmed during approval.
                </Text>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={() => router.push('/loans/programs')}
            className="bg-[#009245] py-4 rounded-xl"
          >
            <Text className="text-white text-center text-base font-semibold">
              Continue to Programs
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
