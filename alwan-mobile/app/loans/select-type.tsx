import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const loanTypes = [
  {
    id: 'business',
    name: 'Business Loan',
    icon: 'briefcase-outline',
    color: '#10B981',
    description: 'For starting or expanding your business',
    documents: ['Business Permit', 'Business Plan', 'Proof of Business Activity'],
  },
  {
    id: 'medical',
    name: 'Medical Loan',
    icon: 'medical-outline',
    color: '#EF4444',
    description: 'For medical expenses and healthcare needs',
    documents: ['Medical Certificate', 'Hospital Bills', 'Prescription'],
  },
  {
    id: 'education',
    name: 'Education Loan',
    icon: 'school-outline',
    color: '#3B82F6',
    description: 'For tuition fees and educational expenses',
    documents: ['Enrollment Form', 'School ID', 'Tuition Fee Statement'],
  },
  {
    id: 'emergency',
    name: 'Emergency Loan',
    icon: 'alert-circle-outline',
    color: '#F59E0B',
    description: 'For urgent and unexpected expenses',
    documents: ['Supporting Documents', 'Proof of Emergency'],
  },
  {
    id: 'home_improvement',
    name: 'Home Improvement',
    icon: 'home-outline',
    color: '#8B5CF6',
    description: 'For home repairs and improvements',
    documents: ['Quotation', 'Photos of Home', 'Contractor Details'],
  },
];

export default function SelectLoanTypeScreen() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [document1, setDocument1] = useState<any>(null);
  const [document2, setDocument2] = useState<any>(null);

  const pickDocument = async (docNumber: 1 | 2) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        if (docNumber === 1) {
          setDocument1(result.assets[0]);
        } else {
          setDocument2(result.assets[0]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSubmit = () => {
    console.log('[SelectLoanType] handleSubmit called');
    console.log('[SelectLoanType] selectedType:', selectedType);
    console.log('[SelectLoanType] document1:', document1);
    console.log('[SelectLoanType] document2:', document2);
    
    if (!selectedType || !document1 || !document2) {
      console.log('[SelectLoanType] Missing data - showing error');
      Alert.alert('Error', 'Please select a loan type and upload both required documents');
      return;
    }

    console.log('[SelectLoanType] Navigating to calculator');
    router.push('/loans/calculator');
  };

  const selectedLoanType = loanTypes.find(type => type.id === selectedType);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Select Loan Type</Text>
          <Text className="text-sm text-gray-600 mt-2">
            Choose the purpose of your loan and upload required documents
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Loan Types */}
          <Text className="text-base font-semibold text-gray-900 mb-4">
            What is your loan for?
          </Text>

          {loanTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              className={`mb-3 rounded-xl p-4 border-2 ${
                selectedType === type.id
                  ? 'border-[#009245] bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <Ionicons name={type.icon as any} size={24} color={type.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">{type.name}</Text>
                  <Text className="text-xs text-gray-600 mt-1">{type.description}</Text>
                </View>
                {selectedType === type.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#009245" />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Required Documents */}
          {selectedLoanType && (
            <View className="mt-6">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Required Documents (2)
              </Text>
              <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <Text className="text-sm text-blue-900 font-semibold mb-2">
                  Please upload two of the following:
                </Text>
                {selectedLoanType.documents.map((doc, index) => (
                  <Text key={index} className="text-sm text-blue-800 mb-1">
                    • {doc}
                  </Text>
                ))}
              </View>

              {/* Document 1 Upload */}
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Document 1
              </Text>
              <TouchableOpacity
                onPress={() => pickDocument(1)}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center bg-gray-50 mb-4"
              >
                {document1 ? (
                  <View className="items-center">
                    <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
                      <Ionicons name="document-text" size={32} color="#009245" />
                    </View>
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      {document1.name}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-2">
                      {(document1.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                    <Text className="text-sm text-[#009245]">Tap to change</Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center mb-3">
                      <Ionicons name="cloud-upload-outline" size={32} color="#6B7280" />
                    </View>
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      Upload First Document
                    </Text>
                    <Text className="text-sm text-gray-600">
                      PDF, JPG, or PNG (Max 10MB)
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Document 2 Upload */}
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Document 2
              </Text>
              <TouchableOpacity
                onPress={() => pickDocument(2)}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center bg-gray-50 mb-6"
              >
                {document2 ? (
                  <View className="items-center">
                    <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
                      <Ionicons name="document-text" size={32} color="#009245" />
                    </View>
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      {document2.name}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-2">
                      {(document2.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                    <Text className="text-sm text-[#009245]">Tap to change</Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center mb-3">
                      <Ionicons name="cloud-upload-outline" size={32} color="#6B7280" />
                    </View>
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      Upload Second Document
                    </Text>
                    <Text className="text-sm text-gray-600">
                      PDF, JPG, or PNG (Max 10MB)
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!document1 || !document2}
                className={`py-4 rounded-xl ${
                  document1 && document2 ? 'bg-[#009245]' : 'bg-gray-300'
                }`}
              >
                <Text className="text-white text-center text-base font-semibold">
                  Continue to Calculator
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
