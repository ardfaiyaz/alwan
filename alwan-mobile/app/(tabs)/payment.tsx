import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('center');

  const history = [
    {
      id: 1,
      target: 'Kabalikat Loan',
      amount: -2000,
      date: 'Feb 13, 2026',
      icon: 'calendar',
      status: 'Verified',
      category: 'Week 3 Amortization',
    },
    {
      id: 2,
      target: 'CBU Savings',
      amount: 500,
      date: 'Feb 12, 2026',
      icon: 'add-circle',
      status: 'Verified',
      category: 'Capital Build-up',
    }
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* KMBI Green Gradient Top Dashboard (GCash Layout) */}
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

        {/* Loan Balance Card - KMBI Hybrid Style */}
        <View className="bg-white rounded-2xl p-6 shadow-md -mb-20 border border-emerald-50">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Outstanding Balance</Text>
              <View className="flex-row items-baseline mt-1">
                <Text className="text-[#047857] text-xl font-bold">P</Text>
                <Text className="text-[#047857] text-3xl font-bold ml-1">6,000.00</Text>
              </View>
            </View>
            <View className="w-12 h-12 bg-emerald-50 rounded-full items-center justify-center">
              <Ionicons name="cash-outline" size={26} color="#047857" />
            </View>
          </View>

          <View className="flex-row justify-between bg-gray-50 rounded-xl p-3 border border-emerald-50/50">
            <View>
              <Text className="text-gray-500 text-[10px] uppercase font-bold">Principal</Text>
              <Text className="text-gray-800 font-bold text-sm">P 5,400</Text>
            </View>
            <View className="w-px h-6 bg-gray-200" />
            <View>
              <Text className="text-gray-500 text-[10px] uppercase font-bold">Interest</Text>
              <Text className="text-gray-800 font-bold text-sm">P 600</Text>
            </View>
            <View className="w-px h-6 bg-gray-200" />
            <View>
              <Text className="text-gray-500 text-[10px] uppercase font-bold">CBU Savings</Text>
              <Text className="text-[#F97316] font-bold text-sm">P 3,500</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 mt-12" showsVerticalScrollIndicator={false}>
        {/* Payment Methods - KMBI Hybrid */}
        <View className="px-6 pt-10 pb-6">
          <Text className="text-gray-800 text-lg font-bold mb-4">Payment Methods</Text>
          {[
            { id: 'center', name: 'Center Collection', detail: 'St. Jude Center Meeting', icon: 'people' },
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

        {/* Submit Repayment Button - KMBI Orange/Green Accent */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            className="bg-[#047857] py-4 rounded-full items-center justify-center shadow-lg"
            onPress={() => Alert.alert('Repayment', 'Submit weekly amortization?')}
          >
            <Text className="text-white font-bold text-lg">Submit Repayment</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History - KMBI Colors */}
        <View className="px-6 pb-12">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-800 text-lg font-bold">Repayment History</Text>
            <TouchableOpacity>
              <Text className="text-[#047857] text-sm font-bold">Full Statement</Text>
            </TouchableOpacity>
          </View>

          {history.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center border-b border-gray-50 py-4"
              onPress={() => Alert.alert('Details', item.category)}
            >
              <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mr-4">
                <Ionicons name={item.icon as any} size={20} color="#047857" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-bold text-sm">{item.category}</Text>
                <Text className="text-gray-400 text-xs">{item.date}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-800 font-bold text-sm">P {Math.abs(item.amount)}</Text>
                <Text className="text-[#047857] text-[10px] font-bold uppercase">{item.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
