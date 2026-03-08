import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function SavingsScreen() {
  const { user, loanApplication } = useAuth();

  // Check if loan is approved
  const isLoanApproved = loanApplication?.status === 'approved';

  // Mock savings data
  const totalSavings = 3250;
  const savingsGoal = 10000;
  const savedPercentage = (totalSavings / savingsGoal) * 100;
  const remainingAmount = savingsGoal - totalSavings;
  const memberSince = 'January 2025';

  // Mock deposit history
  const deposits = [
    {
      id: '1',
      type: 'Weekly Deposit',
      amount: 250,
      date: new Date(2026, 1, 17), // Feb 17, 2026
    },
    {
      id: '2',
      type: 'Weekly Deposit',
      amount: 250,
      date: new Date(2026, 1, 10), // Feb 10, 2026
    },
    {
      id: '3',
      type: 'Bonus Deposit',
      amount: 500,
      date: new Date(2026, 1, 3), // Feb 3, 2026
    },
    {
      id: '4',
      type: 'Weekly Deposit',
      amount: 250,
      date: new Date(2026, 0, 27), // Jan 27, 2026
    },
    {
      id: '5',
      type: 'Weekly Deposit',
      amount: 250,
      date: new Date(2026, 0, 20), // Jan 20, 2026
    },
    {
      id: '6',
      type: 'Weekly Deposit',
      amount: 250,
      date: new Date(2026, 0, 13), // Jan 13, 2026
    },
  ];

  // Show locked state if loan not approved
  if (!isLoanApproved) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="lock-closed" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">Savings Locked</Text>
          <Text className="text-gray-600 text-center">
            Apply for and get your loan approved to access savings features
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header - Total Savings */}
        <View className="bg-[#009245] px-6 pt-8 pb-12">
          <Text className="text-white/80 text-base mb-2">Total Savings</Text>
          <Text className="text-white text-6xl font-bold mb-2">₱{totalSavings.toLocaleString()}</Text>
          <Text className="text-white/80 text-base">Since {memberSince}</Text>
        </View>

        <View className="px-4 -mt-6">
          {/* Motivational Banner */}
          <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex-row items-center shadow-sm">
            <Text className="text-3xl mr-3">🌱</Text>
            <Text className="flex-1 text-green-900 font-semibold text-base">
              Keep saving for your future! 🌱
            </Text>
          </View>

          {/* Savings Goal Card */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Ionicons name="trending-up" size={24} color="#009245" />
                <Text className="text-gray-900 font-bold text-xl ml-2">Savings Goal</Text>
              </View>
              <Text className="text-[#009245] font-bold text-xl">{Math.round(savedPercentage)}%</Text>
            </View>

            {/* Progress Bar */}
            <View className="bg-gray-200 rounded-full h-3 mb-4">
              <View 
                className="bg-[#009245] rounded-full h-3" 
                style={{ width: `${savedPercentage}%` }}
              />
            </View>

            {/* Saved vs Goal */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-gray-500 text-sm mb-1">Saved</Text>
                <Text className="text-gray-900 font-bold text-lg">₱{totalSavings.toLocaleString()}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-500 text-sm mb-1">Goal</Text>
                <Text className="text-gray-900 font-bold text-lg">₱{savingsGoal.toLocaleString()}</Text>
              </View>
            </View>

            {/* Remaining Amount */}
            <View className="bg-green-50 rounded-xl p-3">
              <Text className="text-green-900 text-sm">
                ₱{remainingAmount.toLocaleString()} more to reach your goal! 🎯
              </Text>
            </View>
          </View>

          {/* Deposit History */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 font-bold text-xl">Deposit History</Text>
              <TouchableOpacity>
                <Text className="text-[#009245] font-semibold text-base">View All</Text>
              </TouchableOpacity>
            </View>

            {deposits.map((deposit, index) => (
              <View
                key={deposit.id}
                className={`flex-row items-center justify-between py-4 ${
                  index !== deposits.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base mb-1">
                    {deposit.type}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {deposit.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </Text>
                </View>
                <Text className="text-green-600 font-bold text-lg">
                  +₱{deposit.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>

          {/* Info Banner */}
          <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 flex-row items-start">
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <Text className="text-blue-900 font-semibold text-sm mb-1">
                About Your Savings
              </Text>
              <Text className="text-blue-800 text-sm">
                Part of your weekly payment automatically goes to your savings account. This helps you build financial security for the future.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
