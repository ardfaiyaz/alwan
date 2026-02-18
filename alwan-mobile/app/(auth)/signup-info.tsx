import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

export default function SignupInfoScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [document, setDocument] = useState<any>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setDocument(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleContinue = () => {
    if (firstName && lastName && address && document) {
      router.push('/(auth)/signup-phone');
    }
  };

  const isValid = firstName && lastName && address && document;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-base text-gray-600">Step 1 of 4: Personal Information</Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* First Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">First Name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-4 text-base text-gray-900 bg-gray-50"
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Last Name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-4 text-base text-gray-900 bg-gray-50"
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Address */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Complete Address</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-4 text-base text-gray-900 bg-gray-50"
              placeholder="Enter your complete address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Document Upload */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Valid ID / Document</Text>
            <TouchableOpacity
              onPress={pickDocument}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center bg-gray-50"
            >
              {document ? (
                <View className="items-center">
                  <Ionicons name="document-text" size={40} color="#009245" />
                  <Text className="text-sm text-gray-700 mt-2 text-center">{document.name}</Text>
                  <Text className="text-xs text-gray-500 mt-1">Tap to change</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="cloud-upload-outline" size={40} color="#9CA3AF" />
                  <Text className="text-sm text-gray-700 mt-2">Upload Valid ID</Text>
                  <Text className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isValid}
          className={`py-4 rounded-xl mb-6 ${isValid ? 'bg-[#009245]' : 'bg-gray-300'}`}
        >
          <Text className="text-white text-center text-base font-semibold">Continue</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center mb-8">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-[#009245] font-semibold">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
