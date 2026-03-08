import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function TransactionsScreen() {
  const { transactions, paymentSchedules, loanApplication } = useAuth();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'loan_disbursement':
        return { name: 'arrow-down-circle' as const, color: '#10B981' };
      case 'loan_payment':
        return { name: 'arrow-up-circle' as const, color: '#EF4444' };
      case 'savings_deposit':
        return { name: 'wallet' as const, color: '#8B5CF6' };
      case 'savings_withdrawal':
        return { name: 'cash' as const, color: '#F59E0B' };
      case 'insurance_payment':
        return { name: 'shield-checkmark' as const, color: '#3B82F6' };
      default:
        return { name: 'swap-horizontal' as const, color: '#6B7280' };
    }
  };

  const nextPayment = paymentSchedules.find(s => s.status === 'pending');
  const paidPayments = paymentSchedules.filter(s => s.status === 'paid').length;
  const totalPayments = paymentSchedules.length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-[#009245] px-6 pt-6 pb-8 rounded-b-3xl">
          <Text className="text-white text-2xl font-bold mb-6">Transactions</Text>

          {/* Payment Progress */}
          {loanApplication && paymentSchedules.length > 0 && (
            <View className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-sm">Payment Progress</Text>
                <Text className="text-white font-semibold">
                  {paidPayments}/{totalPayments} weeks
                </Text>
              </View>
              <View className="bg-white/20 rounded-full h-2 mb-2">
                <View 
                  className="bg-white rounded-full h-2" 
                  style={{ width: `${(paidPayments / totalPayments) * 100}%` }}
                />
              </View>
              {nextPayment && (
                <Text className="text-white/80 text-xs">
                  Next: ₱{nextPayment.amount.toFixed(2)} due {nextPayment.dueDate.toLocaleDateString()}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Payment Schedule */}
        {paymentSchedules.length > 0 && (
          <View className="px-6 py-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">Payment Schedule</Text>
            
            {paymentSchedules.slice(0, 5).map((schedule) => (
              <View
                key={schedule.id}
                className={`bg-white rounded-xl p-4 mb-3 border-2 ${
                  schedule.status === 'paid' ? 'border-green-200' :
                  schedule.status === 'overdue' ? 'border-red-200' :
                  'border-gray-200'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="font-semibold text-gray-900 mr-2">
                        Week {schedule.weekNumber}
                      </Text>
                      <View className={`px-2 py-1 rounded-full ${
                        schedule.status === 'paid' ? 'bg-green-100' :
                        schedule.status === 'overdue' ? 'bg-red-100' :
                        'bg-yellow-100'
                      }`}>
                        <Text className={`text-xs font-semibold ${
                          schedule.status === 'paid' ? 'text-green-700' :
                          schedule.status === 'overdue' ? 'text-red-700' :
                          'text-yellow-700'
                        }`}>
                          {schedule.status === 'paid' ? 'Paid' :
                           schedule.status === 'overdue' ? 'Overdue' :
                           'Pending'}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-600">
                      Due: {schedule.dueDate.toLocaleDateString()}
                    </Text>
                    {schedule.paidAt && (
                      <Text className="text-xs text-green-600">
                        Paid: {schedule.paidAt.toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  <Text className="text-lg font-bold text-gray-900">
                    ₱{schedule.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            {paymentSchedules.length > 5 && (
              <TouchableOpacity className="bg-gray-100 py-3 rounded-xl">
                <Text className="text-gray-700 text-center font-semibold">
                  View All {paymentSchedules.length} Payments
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Transaction History */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Transaction History</Text>
          
          {transactions.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-center">
                No transactions yet
              </Text>
            </View>
          ) : (
            transactions.map((transaction) => {
              const icon = getTransactionIcon(transaction.type);
              return (
                <View
                  key={transaction.id}
                  className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
                >
                  <View className="flex-row items-center">
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3`} style={{ backgroundColor: `${icon.color}20` }}>
                      <Ionicons name={icon.name} size={20} color={icon.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900">
                        {transaction.description}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {transaction.date.toLocaleDateString()} • {transaction.date.toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text className={`text-lg font-bold ${
                      transaction.type === 'loan_disbursement' || transaction.type === 'savings_withdrawal'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'loan_disbursement' || transaction.type === 'savings_withdrawal' ? '+' : '-'}
                      ₱{transaction.amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
