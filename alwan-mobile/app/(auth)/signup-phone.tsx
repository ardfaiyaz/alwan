import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupPhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    if (phoneNumber.length >= 10) {
      // Simulate sending OTP
      router.push('/(auth)/signup-otp');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Phone Number</Text>
          <Text className="text-base text-gray-600">Step 2 of 4: We'll send you an OTP</Text>
        </View>

        {/* Phone Input */}
        <View className="mb-8">
          <Text className="text-sm font-medium text-gray-700 mb-2">Mobile Number</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-4 bg-gray-50">
            <Text className="text-base text-gray-700 mr-2">+63</Text>
            <TextInput
              className="flex-1 text-base text-gray-900"
              placeholder="9XX XXX XXXX"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoFocus
            />
          </View>
          <Text className="text-xs text-gray-500 mt-2">
            We'll send a verification code to this number
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={phoneNumber.length < 10}
          className={`py-4 rounded-xl ${phoneNumber.length >= 10 ? 'bg-[#009245]' : 'bg-gray-300'}`}
        >
          <Text className="text-white text-center text-base font-semibold">Send OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
