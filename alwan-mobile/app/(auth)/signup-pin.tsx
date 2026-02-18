import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function SignupPinScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [pin, setPin] = useState(['', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '']);
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handlePinChange = (value: string, index: number, isConfirm: boolean) => {
    if (value.length > 1) return;
    
    if (isConfirm) {
      const newPin = [...confirmPin];
      newPin[index] = value;
      setConfirmPin(newPin);

      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newPin.every(digit => digit !== '') && index === 4) {
        handleComplete();
      }
    } else {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newPin.every(digit => digit !== '') && index === 4) {
        setStep('confirm');
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    const currentPin = step === 'confirm' ? confirmPin : pin;
    if (e.nativeEvent.key === 'Backspace' && !currentPin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleComplete = async () => {
    if (pin.join('') === confirmPin.join('')) {
      // PIN created successfully, create user and redirect to orientation
      try {
        await signup({
          firstName: 'Maria',
          lastName: 'Santos',
          phoneNumber: '1234567890',
          address: 'Sample Address',
        });
        router.replace('/(auth)/orientation-1');
      } catch (error) {
        console.error('Signup error:', error);
      }
    } else {
      // Reset confirm PIN
      setConfirmPin(['', '', '', '', '']);
      setStep('create');
      inputRefs.current[0]?.focus();
    }
  };

  const currentPin = step === 'confirm' ? confirmPin : pin;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'create' ? 'Create PIN' : 'Confirm PIN'}
          </Text>
          <Text className="text-base text-gray-600">
            {step === 'create' 
              ? 'Step 4 of 4: Create a 5-digit security PIN' 
              : 'Re-enter your PIN to confirm'}
          </Text>
        </View>

        {/* PIN Input */}
        <View className="flex-row justify-between mb-8">
          {currentPin.map((digit, index) => (
            <TextInput
              key={`${step}-${index}`}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className="w-14 h-14 border-2 border-gray-300 rounded-xl text-center text-2xl font-bold text-gray-900"
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handlePinChange(value, index, step === 'confirm')}
              onKeyPress={(e) => handleKeyPress(e, index)}
              secureTextEntry
            />
          ))}
        </View>

        {/* Info */}
        <View className="bg-blue-50 p-4 rounded-xl">
          <Text className="text-sm text-blue-900">
            Your PIN will be used to secure your account and authorize transactions.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
