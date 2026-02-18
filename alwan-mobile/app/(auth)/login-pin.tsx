import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function LoginPinScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [pin, setPin] = useState(['', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all filled
    if (newPin.every(digit => digit !== '') && index === 4) {
      handleLogin();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = async () => {
    // For testing, accept any 5-digit PIN and create a mock user
    console.log('[LoginPin] PIN entered, attempting login');
    
    try {
      await login('1234567890', pin.join(''));
      
      console.log('[LoginPin] Login successful');
      console.log('[LoginPin] Redirecting to dashboard (homepage)');
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('[LoginPin] Login error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Enter PIN</Text>
          <Text className="text-base text-gray-600">Enter your 5-digit security PIN</Text>
        </View>

        {/* PIN Input */}
        <View className="flex-row justify-between mb-8">
          {pin.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              className="w-14 h-14 border-2 border-gray-300 rounded-xl text-center text-2xl font-bold text-gray-900"
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handlePinChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              secureTextEntry
            />
          ))}
        </View>

        {/* Forgot PIN */}
        <TouchableOpacity className="items-center">
          <Text className="text-[#009245] font-semibold">Forgot PIN?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
