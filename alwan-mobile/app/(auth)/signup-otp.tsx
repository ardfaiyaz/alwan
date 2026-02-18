import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupOtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    // For testing, accept any 6-digit OTP
    router.push('/(auth)/signup-pin');
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</Text>
          <Text className="text-base text-gray-600">Step 3 of 4: Enter the code sent to your phone</Text>
        </View>

        {/* OTP Input */}
        <View className="flex-row justify-between mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className="w-12 h-14 border-2 border-gray-300 rounded-xl text-center text-2xl font-bold text-gray-900"
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {/* Timer and Resend */}
        <View className="items-center mb-8">
          {timer > 0 ? (
            <Text className="text-gray-600">Resend code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-[#009245] font-semibold">Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={otp.some(digit => digit === '')}
          className={`py-4 rounded-xl ${otp.every(digit => digit !== '') ? 'bg-[#009245]' : 'bg-gray-300'}`}
        >
          <Text className="text-white text-center text-base font-semibold">Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
