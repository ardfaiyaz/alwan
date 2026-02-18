import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProgramsScreen() {
  const router = useRouter();

  const programs = [
    {
      id: 'kabalikat',
      title: 'Kabalikat Loan Program',
      description: 'Entry-level microloans for new members starting their entrepreneurial journey. Designed to build credit history and financial discipline.',
      icon: 'hand-left' as const,
      color: '#10B981',
      bgColor: '#D1FAE5',
      range: '₱3,000 - ₱15,000',
    },
    {
      id: 'maunlad',
      title: 'Maunlad Loan Program',
      description: 'Progressive loans for growing businesses with proven track records. Supports expansion and increased working capital needs.',
      icon: 'trending-up' as const,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      range: '₱15,000 - ₱30,000',
    },
    {
      id: 'masagana',
      title: 'Masagana Loan Program',
      description: 'Agricultural and livelihood loans for farmers and rural entrepreneurs. Tailored for seasonal income patterns and harvest cycles.',
      icon: 'leaf' as const,
      color: '#10B981',
      bgColor: '#D1FAE5',
      range: '₱10,000 - ₱25,000',
    },
    {
      id: 'k-flex',
      title: 'K-Flex Loan Program',
      description: 'Flexible loan terms for members with varying income streams. Offers customizable payment schedules to match cash flow patterns.',
      icon: 'swap-horizontal' as const,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      range: '₱5,000 - ₱20,000',
    },
    {
      id: 'k-agapay',
      title: 'K-Agapay Loan Program',
      description: 'Emergency assistance loans for unexpected expenses like medical bills or urgent repairs. Quick approval process for immediate needs.',
      icon: 'medical' as const,
      color: '#EF4444',
      bgColor: '#FEE2E2',
      range: '₱1,000 - ₱10,000',
    },
    {
      id: 'k-silong',
      title: 'K-Silong Loan Program',
      description: 'Housing improvement loans for home repairs, renovations, and basic shelter needs. Helps families build safer and more comfortable homes.',
      icon: 'home' as const,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      range: '₱10,000 - ₱50,000',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">KMBI Loan Programs</Text>
          <Text className="text-sm text-gray-600 mt-2">
            Choose the right program for your needs
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Info Banner */}
          <View className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#009245" />
              <View className="flex-1 ml-3">
                <Text className="text-green-900 font-semibold mb-2">
                  About Our Programs
                </Text>
                <Text className="text-green-800 text-sm">
                  All programs include mandatory savings and insurance for your protection. 
                  Weekly payments are made at center meetings with your solidarity group.
                </Text>
              </View>
            </View>
          </View>

          {/* Programs List */}
          {programs.map((program) => (
            <TouchableOpacity
              key={program.id}
              className="bg-white rounded-2xl p-5 mb-4 border border-gray-200"
              activeOpacity={0.7}
            >
              <View className="flex-row items-start">
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                  style={{ backgroundColor: program.bgColor }}
                >
                  <Ionicons name={program.icon} size={28} color={program.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900 mb-1">
                    {program.title}
                  </Text>
                  <Text className="text-sm text-green-600 font-semibold mb-2">
                    {program.range}
                  </Text>
                  <Text className="text-sm text-gray-600 leading-5">
                    {program.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </View>
            </TouchableOpacity>
          ))}

          {/* Additional Services */}
          <Text className="text-lg font-bold text-gray-900 mb-4 mt-4">
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
              <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">Microinsurance</Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Life, accident, and burial coverage automatically included with your loan for family protection.
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

          {/* Benefits */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6 mt-4">
            <Text className="font-semibold text-gray-900 mb-3">Why Choose KMBI?</Text>
            <View className="space-y-2">
              <View className="flex-row items-start mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#009245" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  No collateral required
                </Text>
              </View>
              <View className="flex-row items-start mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#009245" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  Flexible payment terms
                </Text>
              </View>
              <View className="flex-row items-start mb-2">
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

          {/* Next Button */}
          <TouchableOpacity
            onPress={() => router.push('/loans/apply-confirmation')}
            className="bg-[#009245] py-4 rounded-xl mb-4"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white text-center text-base font-semibold mr-2">
                Next
              </Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
