import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChangePinScreen() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangePin = () => {
    setSuccess(true);
    setTimeout(() => {
      router.back();
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
              Pin Has Been Changed Successfully
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Purple Header */}
      <View className="bg-purple-600 pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Change Pin</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Card */}
      <View className="flex-1 bg-white rounded-t-[40px] -mt-6 px-6 pt-8">
        <View className="flex-1">
          <View className="mb-4">
            <Text className="text-gray-700 text-sm mb-2">Current Pin</Text>
            <TextInput
              value={currentPin}
              onChangeText={setCurrentPin}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={6}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 text-sm mb-2">New Pin</Text>
            <TextInput
              value={newPin}
              onChangeText={setNewPin}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={6}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 text-sm mb-2">Confirm Pin</Text>
            <TextInput
              value={confirmPin}
              onChangeText={setConfirmPin}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={6}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
            />
          </View>

          <TouchableOpacity
            onPress={handleChangePin}
            className="bg-gray-900 rounded-lg py-4 items-center"
          >
            <Text className="text-white text-lg font-bold">Change Pin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
