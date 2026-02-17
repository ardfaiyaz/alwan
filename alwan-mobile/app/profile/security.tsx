import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function SecurityScreen() {
  const { signOut } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    console.log('[Security] Logout initiated');
    setLogoutModalVisible(true);
  };

  const onConfirmLogout = async () => {
    try {
      console.log('[Security] Executing signOut...');
      setLogoutModalVisible(false);
      await signOut();
      console.log('[Security] signOut success, redirecting to login');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('[Security] Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* Alwan Green Header */}
      <View className="bg-[#047857] pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Security</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* Content Card */}
      <View className="flex-1 bg-white rounded-t-[40px] -mt-6 px-6 pt-8">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-gray-800 text-lg font-semibold mb-4">Account Security</Text>

          <TouchableOpacity
            onPress={() => router.push('/profile/change-pin')}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <Ionicons name="key-outline" size={22} color="#047857" className="mr-3" />
              <Text className="text-gray-800 text-base ml-2">Change Account Pin</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/profile/fingerprint')}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <Ionicons name="finger-print-outline" size={22} color="#047857" className="mr-3" />
              <Text className="text-gray-800 text-base ml-2">Biometric Setup</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/profile/terms')}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <Ionicons name="document-text-outline" size={22} color="#047857" className="mr-3" />
              <Text className="text-gray-800 text-base ml-2">Privacy & Terms</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-between py-4 mt-4"
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={22} color="#EF4444" className="mr-3" />
              <Text className="text-red-500 text-base font-bold ml-2">Logout from Device</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FEE2E2" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ConfirmModal
        visible={logoutModalVisible}
        title="Logout Member"
        message="Are you sure you want to logout from your Alwan account?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={onConfirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
        isDestructive={true}
      />
    </View>
  );
}

