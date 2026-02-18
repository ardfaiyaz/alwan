import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function InsuranceScreen() {
  const { loanApplication } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const isLoanApproved = loanApplication?.status === 'approved';

  const insuranceData = {
    status: 'Active',
    expiryDate: 'Dec 31, 2026',
    memberSince: 'Jan 2025',
    coverage: {
      lifeInsurance: 20000,
      accidentCoverage: 10000,
      spouseCoverage: 10000,
      burialBenefit: 5000,
    },
  };

  const statusHistory = [
    { id: '1', status: 'Premium Paid', date: new Date(2026, 1, 17), amount: 50 },
    { id: '2', status: 'Premium Paid', date: new Date(2026, 1, 10), amount: 50 },
    { id: '3', status: 'Premium Paid', date: new Date(2026, 1, 3), amount: 50 },
    { id: '4', status: 'Coverage Activated', date: new Date(2025, 0, 15), amount: null },
  ];

  const faqs = [
    {
      id: '1',
      question: 'What is micro-insurance?',
      answer: 'Micro-insurance is affordable insurance designed for low-income individuals and families. It provides basic coverage for life, accidents, and burial benefits at a low weekly premium.',
    },
    {
      id: '2',
      question: 'Do I pay extra for insurance?',
      answer: 'No, your insurance premium is automatically included in your weekly payment. A small portion (₱50/week) goes towards your insurance coverage.',
    },
    {
      id: '3',
      question: 'What happens if my insurance expires?',
      answer: 'Your insurance automatically renews as long as you continue making your weekly payments. If you miss payments, your coverage may lapse after a grace period.',
    },
    {
      id: '4',
      question: 'How do I file a claim?',
      answer: 'To file a claim, contact your field officer or visit your center. You\'ll need to provide required documents such as death certificate (for life insurance) or medical records (for accident claims).',
    },
  ];

  if (!isLoanApproved) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="lock-closed" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">Insurance Locked</Text>
          <Text className="text-gray-600 text-center">
            Apply for and get your loan approved to access insurance features
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-[#009245] px-6 pt-8 pb-12">
          <View className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={32} color="white" />
            <Text className="text-white text-3xl font-bold ml-3">Micro-Insurance</Text>
          </View>
          <Text className="text-white/80 text-base mb-4">Your protection plan</Text>
          <View className="bg-green-700 self-start px-4 py-2 rounded-full flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">{insuranceData.status}</Text>
          </View>
        </View>

        <View className="px-4 -mt-6">
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">Expiry Date</Text>
                <Text className="text-gray-900 font-bold text-2xl">{insuranceData.expiryDate}</Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-gray-500 text-sm mb-1">Member Since</Text>
                <Text className="text-gray-900 font-bold text-2xl">{insuranceData.memberSince}</Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="shield-checkmark" size={24} color="#009245" />
              <Text className="text-gray-900 font-bold text-xl ml-2">Coverage Summary</Text>
            </View>

            <View className="flex-row mb-3">
              <View className="flex-1 bg-red-50 rounded-2xl p-4 mr-2">
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mb-3">
                  <Ionicons name="heart" size={24} color="#EF4444" />
                </View>
                <Text className="text-gray-700 text-sm mb-1">Life Insurance</Text>
                <Text className="text-red-600 font-bold text-2xl">
                  ₱{insuranceData.coverage.lifeInsurance.toLocaleString()}
                </Text>
              </View>

              <View className="flex-1 bg-amber-50 rounded-2xl p-4 ml-2">
                <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center mb-3">
                  <Ionicons name="flash" size={24} color="#F59E0B" />
                </View>
                <Text className="text-gray-700 text-sm mb-1">Accident Coverage</Text>
                <Text className="text-amber-600 font-bold text-2xl">
                  ₱{insuranceData.coverage.accidentCoverage.toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="flex-row">
              <View className="flex-1 bg-teal-50 rounded-2xl p-4 mr-2">
                <View className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center mb-3">
                  <Ionicons name="people" size={24} color="#14B8A6" />
                </View>
                <Text className="text-gray-700 text-sm mb-1">Spouse Coverage</Text>
                <Text className="text-teal-600 font-bold text-2xl">
                  ₱{insuranceData.coverage.spouseCoverage.toLocaleString()}
                </Text>
              </View>

              <View className="flex-1 bg-green-50 rounded-2xl p-4 ml-2">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-3">
                  <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                </View>
                <Text className="text-gray-700 text-sm mb-1">Burial Benefit</Text>
                <Text className="text-green-600 font-bold text-2xl">
                  ₱{insuranceData.coverage.burialBenefit.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-teal-50 border border-teal-200 rounded-2xl p-5 mb-4 flex-row items-start">
            <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center mr-3">
              <Text className="text-3xl">🛡️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-teal-900 font-bold text-base mb-2">
                Why do I have insurance?
              </Text>
              <Text className="text-teal-800 text-sm leading-6">
                Your insurance helps protect you and your family in case of emergencies. It is automatically included in your KMBI membership.
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-gray-900 font-bold text-xl mb-4">Insurance Status</Text>
            {statusHistory.map((item, index) => (
              <View
                key={item.id}
                className={`flex-row items-center py-4 ${
                  index !== statusHistory.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  item.amount ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Ionicons 
                    name={item.amount ? 'checkmark-circle' : 'shield-checkmark'} 
                    size={20} 
                    color={item.amount ? '#10B981' : '#3B82F6'} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base mb-1">{item.status}</Text>
                  <Text className="text-gray-500 text-sm">
                    {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>
                {item.amount && (
                  <Text className="text-green-600 font-bold text-base">₱{item.amount}</Text>
                )}
              </View>
            ))}
          </View>

          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-gray-900 font-bold text-2xl mb-4">What is Micro-Insurance?</Text>
            {faqs.map((faq, index) => (
              <View key={faq.id}>
                <TouchableOpacity
                  onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className={`flex-row items-center justify-between py-4 ${
                    index !== faqs.length - 1 || expandedFaq === faq.id ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <Text className="flex-1 text-gray-900 font-semibold text-base pr-4">
                    {faq.question}
                  </Text>
                  <Ionicons 
                    name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'} 
                    size={24} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
                {expandedFaq === faq.id && (
                  <View className="pb-4 pt-2">
                    <Text className="text-gray-600 text-sm leading-6">{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
