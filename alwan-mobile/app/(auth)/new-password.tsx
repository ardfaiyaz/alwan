import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NewPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = () => {
    setSuccess(true);
    setTimeout(() => {
      router.replace('/login');
    }, 2000);
  };

  if (success) {
    return (
      <View className="flex-1">
        <StatusBar style="light" />
        <LinearGradient
          colors={['#7C3AED', '#7C3AED']}
          className="flex-1 items-center justify-center px-6"
        >
          <View className="items-center">
            <View className="w-24 h-24 border-4 border-white rounded-full items-center justify-center mb-4">
              <View className="w-12 h-12 bg-purple-800 rounded-full" />
            </View>
            <Text className="text-white text-xl font-semibold text-center">
              Password Has Been Changed Successfully
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0F766E', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-1"
      >
        <View className="pt-16 pb-8 px-6">
          <Text className="text-white text-3xl font-bold text-center">New Password</Text>
        </View>

        <View className="flex-1 bg-white rounded-t-[40px] mt-8 px-6 pt-8">
          <View className="flex-1">
            <View className="mb-6">
              <Text className="text-gray-700 text-sm mb-2">New Password</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center">
                <TextInput
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  className="text-gray-800 flex-1"
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-gray-700 text-sm mb-2">Confirm New Password</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center">
                <TextInput
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  className="text-gray-800 flex-1"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleChangePassword}
              className="bg-teal-700 rounded-lg py-4 items-center"
            >
              <Text className="text-white text-lg font-bold">Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
