import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
          <Text className="text-white text-3xl font-bold text-center">Welcome</Text>
        </View>

        <View className="flex-1 bg-white rounded-t-[40px] mt-8 px-6 pt-8">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="mb-6">
              <Text className="text-gray-700 text-sm mb-2">Enter Your Number</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <TextInput
                  placeholder="+123 456 789"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  className="text-gray-800 text-base"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2">Password</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center">
                <TextInput
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="text-gray-800 text-base flex-1"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/forgot-password')}
              className="items-end mb-8"
            >
              <Text className="text-purple-600 text-sm">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              className="bg-teal-700 rounded-lg py-4 items-center mb-6"
            >
              <Text className="text-white text-lg font-bold">Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/signup')}
              className="items-center"
            >
              <Text className="text-gray-600 text-sm">
                Don't have an account? <Text className="text-purple-600 font-semibold">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}
