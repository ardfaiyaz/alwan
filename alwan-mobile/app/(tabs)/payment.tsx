import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function PaymentScreen() {
  const { userGroup, transactions, paymentSchedules, loanApplication } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Get next pending or overdue payment
  const nextPayment = paymentSchedules.find(s => s.status === 'pending' || s.status === 'overdue');
  
  // Calculate payment breakdown
  const loanPayment = nextPayment?.amount || 0;
  const savingsDeposit = loanApplication ? Math.round(loanApplication.amount * 0.05) : 0; // 5% of loan
  const insurancePremium = 50; // Fixed premium
  const totalAmountDue = loanPayment + savingsDeposit + insurancePremium;
  
  const dueDate = nextPayment?.dueDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) || 'N/A';
  
  const isOverdue = nextPayment?.status === 'overdue';

  // Mock payment history
  const mockTransactions = [
    {
      id: '1',
      type: 'loan_payment',
      description: 'Weekly Loan Payment',
      amount: 875,
      date: new Date(2026, 1, 17), // Feb 17, 2026
    },
    {
      id: '2',
      type: 'savings_deposit',
      description: 'Savings Deposit',
      amount: 250,
      date: new Date(2026, 1, 17),
    },
    {
      id: '3',
      type: 'insurance_payment',
      description: 'Insurance Premium',
      amount: 50,
      date: new Date(2026, 1, 17),
    },
    {
      id: '4',
      type: 'loan_payment',
      description: 'Weekly Loan Payment',
      amount: 875,
      date: new Date(2026, 1, 10), // Feb 10, 2026
    },
    {
      id: '5',
      type: 'savings_deposit',
      description: 'Savings Deposit',
      amount: 250,
      date: new Date(2026, 1, 10),
    },
    {
      id: '6',
      type: 'insurance_payment',
      description: 'Insurance Premium',
      amount: 50,
      date: new Date(2026, 1, 10),
    },
    {
      id: '7',
      type: 'loan_payment',
      description: 'Weekly Loan Payment',
      amount: 875,
      date: new Date(2026, 1, 3), // Feb 3, 2026
    },
    {
      id: '8',
      type: 'loan_disbursement',
      description: 'Loan Disbursement',
      amount: 15000,
      date: new Date(2026, 0, 15), // Jan 15, 2026
    },
  ];

  // Use mock transactions if no real transactions exist
  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;

  const paymentMethods = [
    { id: 'gcash', name: 'GCash', icon: '💚', color: '#00D632' },
    { id: 'maya', name: 'Maya', icon: '💙', color: '#4169E1' },
    { id: 'cebuana', name: 'Cebuana', icon: '💵', color: '#FFA500' },
  ];

  const handlePayNow = () => {
    if (!selectedMethod) {
      Alert.alert('Payment Method Required', 'Please choose a payment method first');
      return;
    }

    const method = paymentMethods.find(m => m.id === selectedMethod);
    Alert.alert(
      'Payment Confirmation',
      `Process payment of ₱${totalAmountDue} via ${method?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => Alert.alert('Success', 'Payment processed successfully!')
        }
      ]
    );
  };

  // Only show if user has a group
  if (!userGroup) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="wallet-outline" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">No Group Yet</Text>
          <Text className="text-gray-600 text-center">
            Join a solidarity group to access payment features
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header - Total Amount Due */}
        <View className={`px-6 pt-8 pb-12 ${isOverdue ? 'bg-red-600' : 'bg-[#009245]'}`}>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white/80 text-base">Total Amount Due</Text>
            {isOverdue && (
              <View className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">OVERDUE</Text>
              </View>
            )}
          </View>
          <Text className="text-white text-6xl font-bold mb-2">₱{totalAmountDue.toFixed(2)}</Text>
          <Text className="text-white/80 text-base">Due: {dueDate}</Text>
          {isOverdue && nextPayment?.originalAmount && (
            <View className="bg-white/20 rounded-xl p-3 mt-3">
              <Text className="text-white text-xs mb-1">Original Amount: ₱{nextPayment.originalAmount.toFixed(2)}</Text>
              <Text className="text-white text-xs font-bold">
                Penalty (5%): +₱{(nextPayment.amount - nextPayment.originalAmount).toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        <View className="px-4 -mt-6">
          {/* Payment Breakdown Card */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-gray-900 font-bold text-xl mb-4">Payment Breakdown</Text>

            {/* Loan Payment */}
            <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <View className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${
                  isOverdue ? 'bg-red-100' : 'bg-teal-100'
                }`}>
                  <Ionicons name="card" size={24} color={isOverdue ? '#EF4444' : '#14B8A6'} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">Loan Payment</Text>
                  {isOverdue && nextPayment?.originalAmount && (
                    <Text className="text-red-600 text-xs">
                      +₱{(loanPayment - nextPayment.originalAmount).toFixed(2)} penalty
                    </Text>
                  )}
                </View>
              </View>
              <Text className="text-gray-900 font-bold text-lg">₱{loanPayment.toFixed(2)}</Text>
            </View>

            {/* Savings Deposit */}
            <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="cash" size={24} color="#10B981" />
                </View>
                <Text className="text-gray-900 font-semibold text-base">Savings Deposit</Text>
              </View>
              <Text className="text-gray-900 font-bold text-lg">₱{savingsDeposit.toFixed(2)}</Text>
            </View>

            {/* Insurance Premium */}
            <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-amber-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="shield-checkmark" size={24} color="#F59E0B" />
                </View>
                <Text className="text-gray-900 font-semibold text-base">Insurance Premium</Text>
              </View>
              <Text className="text-gray-900 font-bold text-lg">₱{insurancePremium.toFixed(2)}</Text>
            </View>

            {/* Total */}
            <View className={`rounded-xl p-4 mt-4 ${isOverdue ? 'bg-red-50' : 'bg-teal-50'}`}>
              <View className="flex-row items-center justify-between">
                <Text className={`font-bold text-xl ${isOverdue ? 'text-red-900' : 'text-teal-900'}`}>
                  Total
                </Text>
                <Text className={`font-bold text-2xl ${isOverdue ? 'text-red-900' : 'text-teal-900'}`}>
                  ₱{totalAmountDue.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Overdue Warning */}
          {isOverdue && (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
              <View className="flex-row items-start">
                <Ionicons name="warning" size={24} color="#EF4444" />
                <View className="flex-1 ml-3">
                  <Text className="text-red-900 font-bold text-base mb-1">Payment Overdue</Text>
                  <Text className="text-red-800 text-sm">
                    A 5% penalty has been added to your payment. Please settle as soon as possible to avoid additional charges.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Choose Payment Method */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-gray-900 font-bold text-xl mb-4">Choose Payment Method</Text>

            <View className="flex-row justify-between">
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  className={`flex-1 mx-1 rounded-2xl p-6 items-center ${
                    selectedMethod === method.id ? 'bg-teal-100 border-2 border-teal-500' : 'bg-gray-100'
                  }`}
                >
                  <Text className="text-4xl mb-2">{method.icon}</Text>
                  <Text className={`font-bold text-base ${
                    selectedMethod === method.id ? 'text-teal-900' : 'text-gray-900'
                  }`}>
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pay Now Button */}
          <TouchableOpacity
            onPress={handlePayNow}
            className={`py-4 rounded-xl mb-2 ${
              selectedMethod ? 'bg-[#009245]' : 'bg-gray-300'
            }`}
          >
            <Text className="text-white text-center text-lg font-bold">Pay Now</Text>
          </TouchableOpacity>

          {/* Helper Text */}
          {!selectedMethod && (
            <Text className="text-gray-500 text-sm text-center mb-6">
              Please Choose A Payment Method First
            </Text>
          )}

          {/* Payment History */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-gray-900 font-bold text-xl mb-4">Payment History</Text>

            {displayTransactions.length === 0 ? (
              <View className="py-8 items-center">
                <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
                <Text className="text-gray-500 mt-4 text-center">No transactions yet</Text>
              </View>
            ) : (
              <>
                {displayTransactions.map((transaction) => (
                  <View
                    key={transaction.id}
                    className="flex-row items-center py-4 border-b border-gray-100"
                  >
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                      transaction.type === 'loan_payment' ? 'bg-red-100' :
                      transaction.type === 'savings_deposit' ? 'bg-green-100' :
                      transaction.type === 'insurance_payment' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <Ionicons 
                        name={
                          transaction.type === 'loan_payment' ? 'arrow-up' :
                          transaction.type === 'savings_deposit' ? 'wallet' :
                          transaction.type === 'insurance_payment' ? 'shield-checkmark' :
                          'arrow-down'
                        } 
                        size={20} 
                        color={
                          transaction.type === 'loan_payment' ? '#EF4444' :
                          transaction.type === 'savings_deposit' ? '#10B981' :
                          transaction.type === 'insurance_payment' ? '#F59E0B' :
                          '#3B82F6'
                        } 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base">
                        {transaction.description}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {transaction.date.toLocaleDateString()}
                      </Text>
                    </View>
                    <Text className={`font-bold text-base ${
                      transaction.type === 'loan_disbursement' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'loan_disbursement' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
