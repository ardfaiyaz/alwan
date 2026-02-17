import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

type PaymentRecord = {
  id: string;
  week_number: number;
  amount_due: number;
  due_date: string;
  status: string;
};

export default function PaymentScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('center');
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveLoan, setHasActiveLoan] = useState(false);
  const [hasPendingLoan, setHasPendingLoan] = useState(false);

  // Real loan data
  const [activeLoanAmount, setActiveLoanAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [paidAmortizations, setPaidAmortizations] = useState<PaymentRecord[]>([]);

  const fetchPaymentData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // 1. Get user's active loan
      const { data: activeLoan } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();

      setHasActiveLoan(!!activeLoan);

      // Also check for pending loan
      if (!activeLoan) {
        const { data: pendingLoan } = await supabase
          .from('loan_applications')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .limit(1)
          .maybeSingle();
        setHasPendingLoan(!!pendingLoan);
      } else {
        setHasPendingLoan(false);
      }

      if (activeLoan) {
        setActiveLoanAmount(activeLoan.amount);
        const interest = activeLoan.weekly_payment * activeLoan.term_weeks - activeLoan.amount;
        setTotalInterest(interest);

        // 2. Get amortizations to calculate paid vs outstanding
        const { data: amortizations } = await supabase
          .from('amortizations')
          .select('*')
          .eq('loan_application_id', activeLoan.id)
          .order('week_number', { ascending: false });

        if (amortizations) {
          const paid = amortizations.filter(a => a.status === 'paid');
          const paidTotal = paid.reduce((sum: number, a: any) => sum + Number(a.amount_due), 0);
          setTotalPaid(paidTotal);
          setPaidAmortizations(paid.slice(0, 5)); // last 5 payments
        }
      } else {
        setActiveLoanAmount(0);
        setTotalInterest(0);
        setTotalPaid(0);
        setPaidAmortizations([]);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchPaymentData();
    }, [fetchPaymentData])
  );

  const outstandingBalance = activeLoanAmount + totalInterest - totalPaid;
  const cbuBalance = profile?.cbu_balance || 0;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* KMBI Green Gradient Top Dashboard */}
      <LinearGradient
        colors={['#065F46', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-12 px-6"
      >
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-white text-2xl font-bold">Repayments</Text>
          <TouchableOpacity onPress={() => Alert.alert('QR Scanner', 'Opening camera...')}>
            <Ionicons name="qr-code-outline" size={26} color="white" />
          </TouchableOpacity>
        </View>

        {/* Loan Balance Card - only show if active loan */}
        {hasActiveLoan ? (
          <View className="bg-white rounded-2xl p-6 shadow-md -mb-20 border border-emerald-50">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Outstanding Balance</Text>
                <View className="flex-row items-baseline mt-1">
                  <Text className="text-[#047857] text-xl font-bold">P</Text>
                  <Text className="text-[#047857] text-3xl font-bold ml-1">
                    {isLoading ? '...' : outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
              <View className="w-12 h-12 bg-emerald-50 rounded-full items-center justify-center">
                <Ionicons name="cash-outline" size={26} color="#047857" />
              </View>
            </View>

            <View className="flex-row justify-between bg-gray-50 rounded-xl p-3 border border-emerald-50/50">
              <View>
                <Text className="text-gray-500 text-[10px] uppercase font-bold">Principal</Text>
                <Text className="text-gray-800 font-bold text-sm">P {activeLoanAmount.toLocaleString()}</Text>
              </View>
              <View className="w-px h-6 bg-gray-200" />
              <View>
                <Text className="text-gray-500 text-[10px] uppercase font-bold">Interest</Text>
                <Text className="text-gray-800 font-bold text-sm">P {totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
              </View>
              <View className="w-px h-6 bg-gray-200" />
              <View>
                <Text className="text-gray-500 text-[10px] uppercase font-bold">CBU Savings</Text>
                <Text className="text-[#F97316] font-bold text-sm">P {cbuBalance.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="bg-white rounded-2xl p-6 shadow-md -mb-20 border border-emerald-50 items-center">
            <Ionicons name={hasPendingLoan ? 'time' : 'card-outline'} size={40} color={hasPendingLoan ? '#F97316' : '#D1D5DB'} />
            <Text className="text-gray-500 font-bold text-base mt-3">{hasPendingLoan ? 'Application Under Review' : 'No Active Loan'}</Text>
            <Text className="text-gray-400 text-xs mt-1 text-center">{hasPendingLoan ? 'Your loan application is being reviewed' : 'Apply for a loan to see your repayment details here'}</Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView className="flex-1 mt-12" showsVerticalScrollIndicator={false}>
        {hasActiveLoan ? (
          <>
            {/* Payment Methods */}
            <View className="px-6 pt-10 pb-6">
              <Text className="text-gray-800 text-lg font-bold mb-4">Payment Methods</Text>
              {[
                { id: 'center', name: 'Center Collection', detail: profile?.centers?.name ? `${profile.centers.name} Meeting` : 'Center Meeting', icon: 'people' },
                { id: 'qr', name: 'Scan to Pay', detail: 'Repay via center QR', icon: 'qr-code' },
                { id: 'online', name: 'Online / Bank', detail: 'Over-the-counter or App', icon: 'globe' }
              ].map((method) => (
                <TouchableOpacity
                  key={method.id}
                  className="flex-row items-center bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm"
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${selectedMethod === method.id ? 'bg-[#047857]' : 'bg-gray-100'}`}>
                    <Ionicons name={method.icon as any} size={24} color={selectedMethod === method.id ? 'white' : '#9CA3AF'} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base">{method.name}</Text>
                    <Text className="text-gray-500 text-xs">{method.detail}</Text>
                  </View>
                  {selectedMethod === method.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#047857" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Repayment Button */}
            <View className="px-6 mb-8">
              <TouchableOpacity
                className="bg-[#047857] py-4 rounded-full items-center justify-center shadow-lg"
                onPress={() => router.push('/payment/repayment')}
              >
                <Text className="text-white font-bold text-lg">Submit Repayment</Text>
              </TouchableOpacity>
            </View>

            {/* Repayment History */}
            <View className="px-6 pb-12">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-800 text-lg font-bold">Repayment History</Text>
                <TouchableOpacity onPress={() => router.push('/profile/ledger')}>
                  <Text className="text-[#047857] text-sm font-bold">Full Statement</Text>
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <ActivityIndicator color="#047857" className="my-8" />
              ) : paidAmortizations.length > 0 ? (
                paidAmortizations.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="flex-row items-center border-b border-gray-50 py-4"
                    onPress={() => Alert.alert('Details', `Week ${item.week_number} Amortization`)}
                  >
                    <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mr-4">
                      <Ionicons name="calendar" size={20} color="#047857" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-800 font-bold text-sm">Week {item.week_number} Amortization</Text>
                      <Text className="text-gray-400 text-xs">{new Date(item.due_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-800 font-bold text-sm">P {Number(item.amount_due).toLocaleString()}</Text>
                      <Text className="text-[#047857] text-[10px] font-bold uppercase">Verified</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="bg-gray-50 p-6 rounded-xl items-center">
                  <Text className="text-gray-400">No repayment history yet</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View className="px-6 pt-10 items-center">
            {hasPendingLoan ? (
              <TouchableOpacity
                className="bg-[#F97316] py-4 px-8 rounded-full items-center shadow-lg"
                onPress={() => router.push('/loans/active-loans')}
              >
                <Text className="text-white font-bold text-lg">View Pending Application</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-[#047857] py-4 px-8 rounded-full items-center shadow-lg"
                onPress={() => router.push('/loans/apply')}
              >
                <Text className="text-white font-bold text-lg">Apply for a Loan</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
