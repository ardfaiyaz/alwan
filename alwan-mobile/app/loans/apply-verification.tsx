import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

export default function ApplyVerificationScreen() {
  const router = useRouter();
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

  const handleSubmit = () => {
    if (document) {
      Alert.alert(
        'Verification Submitted',
        'Your loan verification documents have been submitted. You will be notified once approved by the admin.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Get Loan Verification</Text>
          <Text className="text-sm text-gray-600 mt-2">
            Upload documents to verify your loan purpose
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Info Card */}
          <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#3B82F6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-900 font-semibold mb-2">Required Documents</Text>
                <Text className="text-blue-800 text-sm mb-2">
                  Please upload one of the following:
                </Text>
                <View className="space-y-1">
                  <Text className="text-blue-800 text-sm">• Business Permit</Text>
                  <Text className="text-blue-800 text-sm">• Business Registration</Text>
                  <Text className="text-blue-800 text-sm">• Proof of Business Activity</Text>
                  <Text className="text-blue-800 text-sm">• Other relevant documents</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Document Upload */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Upload Verification Document
            </Text>
            <TouchableOpacity
              onPress={pickDocument}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 items-center bg-gray-50"
            >
              {document ? (
                <View className="items-center">
                  <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
                    <Ionicons name="document-text" size={32} color="#009245" />
                  </View>
                  <Text className="text-base font-semibold text-gray-900 mb-1">{document.name}</Text>
                  <Text className="text-sm text-gray-600 mb-3">
                    {(document.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                  <Text className="text-sm text-[#009245]">Tap to change document</Text>
                </View>
              ) : (
                <View className="items-center">
                  <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center mb-3">
                    <Ionicons name="cloud-upload-outline" size={32} color="#6B7280" />
                  </View>
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    Upload Document
                  </Text>
                  <Text className="text-sm text-gray-600">
                    PDF, JPG, or PNG (Max 10MB)
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Guidelines */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-2">Guidelines:</Text>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <Text className="text-gray-600 mr-2">•</Text>
                <Text className="flex-1 text-sm text-gray-600">
                  Document must be clear and readable
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-gray-600 mr-2">•</Text>
                <Text className="flex-1 text-sm text-gray-600">
                  All information must be visible
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-gray-600 mr-2">•</Text>
                <Text className="flex-1 text-sm text-gray-600">
                  Document should be recent and valid
                </Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!document}
            className={`py-4 rounded-xl ${document ? 'bg-[#009245]' : 'bg-gray-300'}`}
          >
            <Text className="text-white text-center text-base font-semibold">
              Submit for Verification
            </Text>
          </TouchableOpacity>

          {/* Note */}
          <View className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <Text className="text-sm text-yellow-900 text-center">
              Your application will be reviewed by our team. You'll receive a notification once approved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
