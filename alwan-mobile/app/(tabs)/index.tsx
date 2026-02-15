import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const handleNotifications = () => {
    Alert.alert('Notifications', '3 new center updates available.');
  };

  const services = [
    { id: 'repay', name: 'Repayment', icon: 'send', color: '#047857', label: 'Repay', route: '/payment/repayment' },
    { id: 'cbu', name: 'CBU', icon: 'wallet', color: '#047857', label: 'CBU', route: '/accounts/cbu' },
    { id: 'insure', name: 'MBS', icon: 'shield-checkmark', color: '#047857', label: 'MBS', route: '/discover' },
    { id: 'loans', name: 'Loans', icon: 'cash', color: '#047857', label: 'Loans', route: '/loans/active-loans' },
    { id: 'center', name: 'Center', icon: 'people', color: '#047857', label: '', route: '/discover' },
    { id: 'finlit', name: 'Edu', icon: 'school', color: '#047857', label: '', route: '/discover' },
    { id: 'rewards', name: 'Rewards', icon: 'gift', color: '#047857', label: '', route: '/discover' },
    { id: 'more', name: 'More', icon: 'grid', color: '#047857', label: '', route: '/discover' },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* KMBI Header Style (GCash Layout) */}
      <View className="bg-[#047857] pt-12 pb-4 px-6">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
              <Ionicons name="person" size={20} color="white" />
            </View>
            <View>
              <Text className="text-white text-xs font-medium">Hello,</Text>
              <Text className="text-white text-base font-bold">Liza Dimaguiba</Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => Alert.alert('Help', 'KMBI Support Hotline')}>
              <Ionicons name="help-circle-outline" size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNotifications}>
              <View>
                <Ionicons name="notifications-outline" size={26} color="white" />
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-[#F97316] rounded-full border-2 border-[#047857] items-center justify-center">
                  <View className="w-1.5 h-1.5 bg-white rounded-full" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card - KMBI Themed */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider">Available Balance</Text>
            <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
              <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#047857" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-baseline">
            <Text className="text-[#047857] text-2xl font-bold">P</Text>
            <Text className="text-[#047857] text-4xl font-bold ml-1">
              {isBalanceVisible ? "10,000.00" : "••••••"}
            </Text>
          </View>
          <View className="h-px bg-gray-100 my-4" />
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => router.push('/accounts/cbu')}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-emerald-50 rounded-full items-center justify-center mr-2">
                <Ionicons name="add" size={20} color="#F97316" />
              </View>
              <Text className="text-gray-700 font-semibold">Add Capital</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Service Grid - KMBI Colors */}
        <View className="px-6 py-6 flex-row flex-wrap justify-between">
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              className="items-center mb-6"
              style={{ width: '22%' }}
              onPress={() => router.push(service.route as any)}
            >
              <View className="w-14 h-14 bg-white border border-emerald-50 rounded-full items-center justify-center shadow-sm mb-2">
                <Ionicons name={service.icon as any} size={28} color={service.color} />
              </View>
              <Text className="text-gray-700 text-[11px] font-bold text-center" numberOfLines={1}>{service.label || ' '}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KMBI Promo Slider */}
        <View className="px-4 mb-6">
          <LinearGradient
            colors={['#047857', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            className="rounded-2xl p-5 overflow-hidden"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Kabalikat Loan</Text>
                <Text className="text-white/80 text-xs mt-1">Empowering your small business</Text>
                <TouchableOpacity
                  className="bg-[#F97316] px-4 py-2 rounded-full mt-4 self-start shadow-sm"
                  onPress={() => router.push('/loans/active-loans')}
                >
                  <Text className="text-white text-xs font-bold uppercase">Apply Now</Text>
                </TouchableOpacity>
              </View>
              <View className="w-24 h-24 bg-white/20 rounded-full -mr-8 -mb-12 items-center justify-center">
                <Ionicons name="rocket" size={48} color="white" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Center Meeting Info - Hybrid Look */}
        <View className="px-6 mb-6">
          <Text className="text-gray-800 text-lg font-bold mb-4">Your Center Info</Text>
          <View className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-[#047857] rounded-full items-center justify-center mr-3">
                <Ionicons name="people" size={20} color="white" />
              </View>
              <View>
                <Text className="text-[#047857] font-bold text-base">St. Jude Center</Text>
                <Text className="text-[#047857]/70 text-xs font-medium">Tuesday Meetings • 9:00 AM</Text>
              </View>
            </View>
            <View className="bg-white/70 rounded-xl p-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-xs font-medium">Repayment Status</Text>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-[#F97316] rounded-full mr-2" />
                  <Text className="text-gray-800 font-bold text-xs">Week 4 of 25</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Upcoming Amortization - KMBI Hybrid */}
        <View className="px-6 pb-12">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-800 text-lg font-bold">Upcoming Amortization</Text>
            <TouchableOpacity>
              <Text className="text-[#047857] text-sm font-bold underline">History</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white border border-emerald-50 rounded-2xl p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-emerald-50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="calendar-outline" size={24} color="#047857" />
                </View>
                <View>
                  <Text className="text-gray-800 font-bold">Week 4 Payment</Text>
                  <Text className="text-gray-500 text-xs mt-1">Due Apr 04, 2026</Text>
                </View>
              </View>
              <Text className="text-gray-800 font-bold text-lg">P 2,000</Text>
            </View>
            <TouchableOpacity
              className="bg-[#047857] py-3 rounded-xl items-center justify-center shadow-sm"
              onPress={() => router.push('/payment/repayment')}
            >
              <Text className="text-white font-bold">Submit Repayment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
