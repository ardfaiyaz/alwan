import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function SecurityPinScreen() {
  const [pin, setPin] = useState(['', '', '', '', '', '']);

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
          <Text className="text-white text-3xl font-bold text-center">Security Pin</Text>
        </View>

        <View className="flex-1 bg-white rounded-t-[40px] mt-8 px-6 pt-8">
          <View className="flex-1">
            <Text className="text-gray-800 text-xl font-semibold mb-8 text-center">
              Enter Security Pin
            </Text>

            <View className="flex-row justify-between mb-8">
              {pin.map((digit, index) => (
                <View
                  key={index}
                  className="w-12 h-12 border-2 border-gray-300 rounded-full items-center justify-center"
                >
                  <Text className="text-gray-800 text-lg font-semibold">
                    {digit || ''}
                  </Text>
                </View>
              ))}
            </View>

            <TextInput
              value={pin.join('')}
              onChangeText={(value) => {
                const newPin = value.split('').slice(0, 6);
                while (newPin.length < 6) newPin.push('');
                setPin(newPin);
              }}
              keyboardType="number-pad"
              maxLength={6}
              className="absolute opacity-0"
              autoFocus
            />

            <TouchableOpacity
              onPress={() => router.push('/new-password')}
              className="bg-teal-700 rounded-lg py-4 items-center mb-4"
            >
              <Text className="text-white text-lg font-bold">Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-gray-300 rounded-lg py-4 items-center mb-6">
              <Text className="text-gray-700 text-lg font-bold">Send Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/signup')}
              className="items-center"
            >
              <Text className="text-gray-600 text-sm">
                Don't have an account? <Text className="text-purple-600 font-semibold">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
