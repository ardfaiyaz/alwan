import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Member Information',
      items: [
        { id: 'edit', name: 'Update Profile', icon: 'person-outline', color: '#047857', route: '/profile/edit' },
        { id: 'beneficiaries', name: 'MBS Beneficiaries', icon: 'people-outline', color: '#047857', route: '/profile/beneficiaries' },
      ]
    },
    {
      title: 'Financial & Records',
      items: [
        { id: 'loans', name: 'Loan Documents', icon: 'document-text-outline', color: '#047857', route: '/loans/active-loans' },
        { id: 'ledger', name: 'Payment Ledger', icon: 'list-outline', color: '#047857', route: '/profile/ledger' },
      ]
    },
    {
      title: 'Support & Center',
      items: [
        { id: 'center', name: 'Center Leader Portal', icon: 'megaphone-outline', color: '#047857', route: '/profile/ledger' },
        { id: 'policies', name: 'KMBI Policies', icon: 'book-outline', color: '#047857', route: '/profile/terms' },
        { id: 'help', name: 'Help Center', icon: 'help-circle-outline', color: '#047857', route: '/support/help' },
      ]
    }
  ];

  const handleMenuPress = (item: any) => {
    if (item.route) {
      router.push(item.route);
    } else {
      Alert.alert(item.title, `${item.title} feature coming soon`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Logged out', 'Successfully logged out.') }
      ]
    );
  };

  // KMBI Member Health Data
  const healthScore = 92;
  const creditUtilization = 45; // 45% of loanable amount used
  const onTimePayment = 98.5;
  const paymentStreak = 48; // weeks

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* KMBI Green Gradient Header */}
      <LinearGradient
        colors={['#065F46', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-20 px-6 items-center"
      >
        <TouchableOpacity
          className="absolute top-12 right-6"
          onPress={() => Alert.alert('Support', 'KMBI Hotline: 8-123-4567')}
        >
          <Ionicons name="help-buoy-outline" size={24} color="white" />
        </TouchableOpacity>

        <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4 border-2 border-white/30">
          <Ionicons name="person" size={50} color="white" />
        </View>
        <Text className="text-white text-xl font-bold">Liza Dimaguiba</Text>
        <Text className="text-white/80 text-sm mt-1">St. Jude Center | Active Member</Text>
        <View className="mt-3 bg-[#F97316] px-4 py-1 rounded-full shadow-sm">
          <Text className="text-white text-xs font-bold uppercase tracking-widest">Fully Verified</Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Account Health Section - Floating Card Layout */}
        <View className="px-6 -mt-10 mb-6">
          <View className="bg-white rounded-2xl p-5 shadow-md border border-emerald-50">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Overall Account Health</Text>
                <View className="flex-row items-baseline mt-1">
                  <Text className="text-[#047857] text-3xl font-bold">{healthScore}</Text>
                  <Text className="text-gray-400 text-sm ml-1">/100</Text>
                </View>
                <Text className="text-[#F97316] text-xs font-bold mt-1 uppercase">Excellent Member</Text>
              </View>
              <View className="w-16 h-16 bg-emerald-50 rounded-full items-center justify-center">
                <Ionicons name="ribbon" size={40} color="#047857" />
              </View>
            </View>

            {/* Health Indicators */}
            <View className="h-px bg-gray-50 my-2" />

            <View className="mt-3">
              {/* Credit Utilization */}
              <View className="mb-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-600 text-xs font-medium">Loan Utilization</Text>
                  <Text className="text-gray-800 text-xs font-bold">{creditUtilization}%</Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-2 bg-[#047857] rounded-full"
                    style={{ width: `${creditUtilization}%` }}
                  />
                </View>
                <Text className="text-gray-400 text-[9px] mt-1">Healthy: 20% - 60%</Text>
              </View>

              {/* On-Time Payments */}
              <View className="flex-row justify-between items-center bg-emerald-50/50 p-3 rounded-xl border border-emerald-50">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-white rounded-full items-center justify-center mr-3">
                    <Ionicons name="checkmark-circle" size={18} color="#047857" />
                  </View>
                  <View>
                    <Text className="text-gray-800 text-xs font-bold">{onTimePayment}% On-Time</Text>
                    <Text className="text-gray-500 text-[10px]">{paymentStreak} Week Streak</Text>
                  </View>
                </View>
                <Ionicons name="trending-up" size={18} color="#047857" />
              </View>
            </View>
          </View>
        </View>

        {/* Member Services Sections */}
        {menuItems.map((section, idx) => (
          <View key={idx} className="px-6 mb-8">
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">{section.title}</Text>
            <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  className={`flex-row items-center justify-between p-4 ${i !== section.items.length - 1 ? 'border-b border-gray-50' : ''}`}
                  onPress={() => handleMenuPress(item)}
                >
                  <View className="flex-row items-center">
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                    <Text className="text-gray-700 font-medium ml-3">{item.name}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Section */}
        <View className="px-6 pb-12">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-gray-50 py-4 rounded-2xl border border-gray-100"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text className="text-red-500 font-bold ml-2">Logout Member</Text>
          </TouchableOpacity>
          <Text className="text-center text-gray-300 text-[10px] mt-4 uppercase font-bold tracking-widest">Version 2.4.0 • KMBI 2026</Text>
        </View>
      </ScrollView>
    </View>
  );
}
