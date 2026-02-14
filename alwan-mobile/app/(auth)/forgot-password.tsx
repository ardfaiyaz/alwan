import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

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
          <Text className="text-white text-3xl font-bold text-center">Forgot Password</Text>
        </View>

        <View className="flex-1 bg-white rounded-t-[40px] mt-8 px-6 pt-8">
          <View className="flex-1">
            <Text className="text-gray-800 text-2xl font-bold mb-4">Reset Password?</Text>
            <Text className="text-gray-600 text-sm mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </Text>

            <View className="mb-8">
              <Text className="text-gray-700 text-sm mb-2">Enter Email Address</Text>
              <TextInput
                placeholder="example@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push('/security-pin')}
              className="bg-teal-700 rounded-lg py-4 items-center"
            >
              <Text className="text-white text-lg font-bold">Enter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
