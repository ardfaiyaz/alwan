import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ServicesScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loanAmount, setLoanAmount] = useState('');

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-[#009245] px-6 pt-6 pb-8 rounded-b-3xl">
          <Text className="text-white text-2xl font-bold">How to Apply for a Loan</Text>
          <Text className="text-white/80 text-sm mt-1">Step-by-step guide</Text>
        </View>

        {/* Content */}
        <View className="px-4 -mt-2">
          {/* Info Banner */}
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex-row items-start">
            <Ionicons name="information-circle" size={24} color="#F59E0B" />
            <Text className="flex-1 text-amber-900 text-sm ml-3">
              Part of your loan goes to savings and insurance for your protection.
            </Text>
          </View>

          {/* Step Card */}
          <View className="bg-teal-50 rounded-2xl p-5 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-teal-900 font-bold text-lg">Step {currentStep} of 5</Text>
              <View className="flex-row">
                {[1, 2, 3, 4, 5].map((step) => (
                  <View
                    key={step}
                    className={`w-2 h-2 rounded-full mx-1 ${
                      step === currentStep ? 'bg-[#009245]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </View>
            </View>

            <View className="bg-white rounded-2xl p-6 mb-4">
              <View className="w-16 h-16 bg-orange-100 rounded-2xl items-center justify-center mb-4">
                <Text className="text-4xl">📋</Text>
              </View>
              <Text className="text-gray-900 font-bold text-2xl mb-3">Attend Orientation</Text>
              <Text className="text-gray-600 text-base leading-6">
                Join a free group orientation session at your nearest KMBI center. You'll learn about how loans work and meet your group.
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                onPress={handleBack}
                className="flex-1 bg-white border border-gray-300 py-3 rounded-xl mr-2"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="chevron-back" size={20} color="#6B7280" />
                  <Text className="text-gray-700 font-semibold ml-1">Back</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                className="flex-1 bg-[#009245] py-3 rounded-xl ml-2"
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-white font-semibold mr-1">Next</Text>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Requirements */}
          <View className="bg-white rounded-2xl p-5 mb-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Text className="text-2xl">📄</Text>
              </View>
              <Text className="text-gray-900 font-bold text-xl">Requirements</Text>
            </View>

            <View className="space-y-3">
              <View className="flex-row items-start mb-3">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="flex-1 text-gray-700 text-base ml-3">
                  Valid government-issued ID (PhilSys, Voter's ID, etc.)
                </Text>
              </View>
              <View className="flex-row items-start mb-3">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="flex-1 text-gray-700 text-base ml-3">
                  Proof of business or livelihood
                </Text>
              </View>
              <View className="flex-row items-start mb-3">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="flex-1 text-gray-700 text-base ml-3">
                  Community certificate (barangay)
                </Text>
              </View>
              <View className="flex-row items-start mb-3">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="flex-1 text-gray-700 text-base ml-3">
                  Must be 18–65 years old
                </Text>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="flex-1 text-gray-700 text-base ml-3">
                  No existing overdue loans
                </Text>
              </View>
            </View>
          </View>

          {/* Loan Calculator */}
          <View className="bg-white rounded-2xl p-5 mb-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="calculator" size={20} color="#14B8A6" />
              </View>
              <Text className="text-gray-900 font-bold text-xl">Loan Calculator</Text>
            </View>

            <Text className="text-gray-600 text-sm mb-2">Loan Amount (₱)</Text>
            <TextInput
              value={loanAmount}
              onChangeText={setLoanAmount}
              placeholder="e.g. 5000"
              keyboardType="numeric"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
            />
          </View>

          {/* KMBI Programs */}
          <View className="bg-white rounded-2xl p-5 mb-4">
            <Text className="text-gray-900 font-bold text-xl mb-4">KMBI Programs</Text>

            <TouchableOpacity className="bg-teal-50 rounded-xl p-4 mb-3">
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 bg-[#009245] rounded-full mr-3" />
                <Text className="text-gray-900 font-bold text-base">Kabuhayan Loan</Text>
              </View>
              <Text className="text-gray-600 text-sm ml-6">
                For micro-business starters (₱2,000 – ₱20,000)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-teal-50 rounded-xl p-4 mb-3">
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 bg-[#009245] rounded-full mr-3" />
                <Text className="text-gray-900 font-bold text-base">Pantawid Loan</Text>
              </View>
              <Text className="text-gray-600 text-sm ml-6">
                For emergency needs (₱1,000 – ₱5,000)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-teal-50 rounded-xl p-4">
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 bg-[#009245] rounded-full mr-3" />
                <Text className="text-gray-900 font-bold text-base">Kalusugan Insurance</Text>
              </View>
              <Text className="text-gray-600 text-sm ml-6">
                Life & accident coverage for members
              </Text>
            </TouchableOpacity>
          </View>

          {/* Orientation Video */}
          <TouchableOpacity className="bg-gray-100 rounded-2xl p-8 mb-6 items-center">
            <View className="w-20 h-20 bg-teal-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="play" size={40} color="#14B8A6" />
            </View>
            <Text className="text-gray-900 font-bold text-lg mb-1">Orientation Video</Text>
            <Text className="text-gray-600 text-sm">Watch before applying</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
