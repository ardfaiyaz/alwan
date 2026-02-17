import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [upcomingAmortization, setUpcomingAmortization] = useState<{
    amount_due: number;
    due_date: string;
    week_number: number;
  } | null>(null);
  const [hasActiveLoan, setHasActiveLoan] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLoanStatus();
    }
  }, [user]);

  const fetchLoanStatus = async () => {
    try {
      // 1. Check if user has an active loan
      const { data: activeLoan, error: loanError } = await supabase
        .from('loan_applications')
        .select('id')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();

      setHasActiveLoan(!!activeLoan);

      // 2. Find the first unpaid amortization if they have a loan
      if (activeLoan) {
        const { data, error } = await supabase
          .from('amortizations')
          .select('*')
          .eq('loan_application_id', activeLoan.id)
          .eq('status', 'unpaid')
          .order('due_date', { ascending: true })
          .limit(1)
          .single();

        if (!error && data) {
          setUpcomingAmortization(data);
        }
      } else {
        setUpcomingAmortization(null);
      }
    } catch (err) {
      console.error('Error fetching loan status:', err);
    }
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', '3 new center updates available.');
  };

  const services = [
    { id: 'repay', name: 'Repayment', icon: 'send', color: '#047857', label: 'Repay', route: '/payment/repayment' },
    { id: 'cbu', name: 'CBU', icon: 'wallet', color: '#047857', label: 'CBU', route: '/accounts/cbu' },
    { id: 'insure', name: 'Insurance', icon: 'shield-checkmark', color: '#047857', label: 'Protect', route: '/' },
    { id: 'loans', name: 'Loans', icon: 'cash', color: '#047857', label: 'Loans', route: '/loans/active-loans' },
    { id: 'center', name: 'Center', icon: 'people', color: '#047857', label: '', route: '/' },
    { id: 'finlit', name: 'Edu', icon: 'school', color: '#047857', label: '', route: '/' },
    { id: 'rewards', name: 'Rewards', icon: 'gift', color: '#047857', label: '', route: '/' },
    { id: 'more', name: 'More', icon: 'grid', color: '#047857', label: '', route: '/' },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* Alwan Header Style */}
      <View className="bg-[#047857] pt-12 pb-4 px-6">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => router.push('/(tabs)/account')}
          >
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
              <Ionicons name="person" size={20} color="white" />
            </View>
            <View>
              <Text className="text-white text-xs font-medium">Welcome back,</Text>
              <Text className="text-white text-base font-bold">{profile?.full_name || 'Loading...'}</Text>
            </View>
          </TouchableOpacity>
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => Alert.alert('Help', 'Alwan Support Hotline')}>
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

        {/* Balance Card - Alwan Themed */}
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
              {isBalanceVisible ? (profile?.total_savings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00') : "••••••"}
            </Text>
          </View>

          {/* Savings Goal Progress */}
          {profile?.savings_goal && (
            <View className="mt-4 pt-4 border-t border-gray-50">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tight">Main Savings Goal</Text>
                <Text className="text-[#047857] text-[10px] font-bold">
                  {Math.round(((profile.total_savings || 0) / profile.savings_goal) * 100)}%
                </Text>
              </View>
              <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="bg-[#047857] h-full"
                  style={{ width: `${Math.min(100, ((profile.total_savings || 0) / profile.savings_goal) * 100)}%` }}
                />
              </View>
              <Text className="text-gray-400 text-[10px] mt-1 italic text-center">
                P {(profile.total_savings || 0).toLocaleString()} of P {profile.savings_goal.toLocaleString()} target
              </Text>
            </View>
          )}

          <View className="h-px bg-gray-100 my-4" />
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => router.push('/(tabs)/savings')}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-emerald-50 rounded-full items-center justify-center mr-2">
                <Ionicons name="wallet-outline" size={20} color="#F97316" />
              </View>
              <Text className="text-gray-700 font-semibold">Manage Savings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Service Grid - Alwan Colors */}
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

        {/* Alwan Promo Slider - Existing */}
        <View className="px-4 mb-6">
          <LinearGradient
            colors={['#047857', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            className="rounded-2xl p-5 overflow-hidden"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Alwan Growth Loan</Text>
                <Text className="text-white/80 text-xs mt-1">Empowering your small business</Text>
                <TouchableOpacity
                  className="bg-[#F97316] px-4 py-2 rounded-full mt-4 self-start shadow-sm"
                  onPress={() => router.push('/loans/active-loans')}
                >
                  <Text className="text-white text-xs font-bold uppercase">
                    {hasActiveLoan ? 'View Active Loan' : 'Apply Now'}
                  </Text>
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
          <Text className="text-gray-800 text-lg font-bold mb-4">Your Community Info</Text>
          <View className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-[#047857] rounded-full items-center justify-center mr-3">
                <Ionicons name="people" size={20} color="white" />
              </View>
              <View>
                <Text className="text-[#047857] font-bold text-base">{profile?.centers?.name || 'KMBI Center'}</Text>
                <Text className="text-[#047857]/70 text-xs font-medium">
                  {profile?.centers?.meeting_day ? `${profile.centers.meeting_day} Meetings` : 'Upcoming Meeting'} • 9:00 AM
                </Text>
              </View>
            </View>
            <View className="bg-white/70 rounded-xl p-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-xs font-medium">Repayment Status</Text>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-[#F97316] rounded-full mr-2" />
                  <Text className="text-gray-800 font-bold text-xs">
                    {upcomingAmortization ? `Week ${upcomingAmortization.week_number} Due` : 'No Pending Payments'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Featured Banner - Moved from Discover */}
        <View className="px-4 mb-6">
          <Text className="text-gray-800 text-lg font-bold mb-4 px-2">Alwan Programs</Text>
          <TouchableOpacity
            className="bg-white border border-emerald-50 rounded-2xl overflow-hidden shadow-sm"
            onPress={() => Alert.alert('Scholarship', 'Alwan Educational Support 2026')}
          >
            <LinearGradient
              colors={['#047857', '#059669']}
              className="px-6 py-6"
            >
              <Text className="text-white text-xl font-bold">Alwan Future Fund 2026</Text>
              <Text className="text-white/80 text-sm mt-1">Support for your children's education</Text>
              <View className="mt-4 bg-[#F97316] self-start px-4 py-1.5 rounded-full shadow-sm">
                <Text className="text-white text-xs font-bold uppercase tracking-tight">Learn More</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Upcoming Amortization - Only show if has active loan or pending amortization */}
        {hasActiveLoan && (
          <View className="px-6 mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-800 text-lg font-bold">Upcoming Amortization</Text>
              <TouchableOpacity onPress={() => router.push('/loans/active-loans')}>
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
                    <Text className="text-gray-800 font-bold">
                      {upcomingAmortization ? `Week ${upcomingAmortization.week_number} Payment` : 'All Paid Up!'}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      {upcomingAmortization ? `Due ${new Date(upcomingAmortization.due_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}` : 'No more payments for this cycle'}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-800 font-bold text-lg">
                  P {upcomingAmortization ? upcomingAmortization.amount_due.toLocaleString() : '0'}
                </Text>
              </View>
              {upcomingAmortization && (
                <TouchableOpacity
                  className="bg-[#047857] py-3 rounded-xl items-center justify-center shadow-sm"
                  onPress={() => router.push('/payment/repayment')}
                >
                  <Text className="text-white font-bold">Submit Repayment</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* FAQ Section - Moved from Discover */}
        <View className="px-6 pb-12">
          <Text className="text-gray-800 text-lg font-bold mb-4">Helpful Guides</Text>
          {[
            { q: 'How to apply for Alwan Growth Loan?', icon: 'cash' },
            { q: 'Registering for Alwan Protect', icon: 'shield' },
            { q: 'Using your CBU for savings', icon: 'wallet' }
          ].map((guide, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center py-4 border-b border-gray-50"
              onPress={() => Alert.alert('Guide', guide.q)}
            >
              <View className="w-8 h-8 bg-emerald-50 rounded-full items-center justify-center mr-3">
                <Ionicons name={guide.icon as any} size={16} color="#047857" />
              </View>
              <Text className="flex-1 text-gray-700 font-medium text-sm">{guide.q}</Text>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
