import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// Philippine data
const PROVINCES = [
  'Metro Manila', 'Cebu', 'Davao del Sur', 'Laguna', 'Cavite', 'Bulacan', 
  'Pampanga', 'Batangas', 'Rizal', 'Pangasinan', 'Iloilo', 'Negros Occidental'
];

const CITIES: { [key: string]: string[] } = {
  'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig', 'Mandaluyong', 'Caloocan', 'Marikina'],
  'Cebu': ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Toledo'],
  'Davao del Sur': ['Davao City', 'Digos', 'Bansalan', 'Hagonoy'],
  'Laguna': ['Calamba', 'Santa Rosa', 'Biñan', 'San Pedro', 'Cabuyao'],
  'Cavite': ['Bacoor', 'Dasmariñas', 'Imus', 'General Trias', 'Tagaytay'],
};

const BARANGAYS = [
  'Barangay 1', 'Barangay 2', 'Barangay 3', 'San Jose', 'Santa Maria', 
  'San Pedro', 'Poblacion', 'Santo Niño', 'San Antonio', 'San Miguel'
];

const NATIONALITIES = [
  'Filipino', 'American', 'Chinese', 'Japanese', 'Korean', 'Indian', 'Other'
];

const SOURCE_OF_FUNDS = [
  'Employment/Salary', 'Business Income', 'Remittance', 'Pension', 
  'Investment', 'Savings', 'Other'
];

export default function SignupInfoScreen() {
  const router = useRouter();
  
  // Personal Info
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [nationality, setNationality] = useState('Filipino');
  const [sourceOfFunds, setSourceOfFunds] = useState('Employment/Salary');
  
  // Current Address
  const [currentProvince, setCurrentProvince] = useState('Metro Manila');
  const [currentCity, setCurrentCity] = useState('Manila');
  const [currentBarangay, setCurrentBarangay] = useState('Barangay 1');
  const [currentZipCode, setCurrentZipCode] = useState('');
  const [currentHouseStreet, setCurrentHouseStreet] = useState('');
  
  // Permanent Address
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const [permanentProvince, setPermanentProvince] = useState('Metro Manila');
  const [permanentCity, setPermanentCity] = useState('Manila');
  const [permanentBarangay, setPermanentBarangay] = useState('Barangay 1');
  const [permanentZipCode, setPermanentZipCode] = useState('');
  const [permanentHouseStreet, setPermanentHouseStreet] = useState('');
  
  // Document
  const [proofOfBilling, setProofOfBilling] = useState<any>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setProofOfBilling(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleContinue = () => {
    console.log('[SignupInfo] Validating form');
    
    if (!firstName || !lastName || !birthdate || !currentZipCode || !currentHouseStreet || !proofOfBilling) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    console.log('[SignupInfo] Form valid, proceeding to phone verification');
    router.push('/(auth)/signup-phone');
  };

  const isValid = firstName && lastName && birthdate && currentZipCode && currentHouseStreet && proofOfBilling;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-8">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-base text-gray-600">Step 1 of 4: Personal Information</Text>
        </View>

        {/* Personal Information Section */}
        <Text className="text-lg font-bold text-gray-900 mb-4">Personal Information</Text>
        
        {/* First Name */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">First Name *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
            placeholder="Enter first name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        {/* Middle Name */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Middle Name</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
            placeholder="Enter middle name (optional)"
            value={middleName}
            onChangeText={setMiddleName}
          />
        </View>

        {/* Last Name */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Last Name *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
            placeholder="Enter last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* Birthdate */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Birthdate *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
            placeholder="MM/DD/YYYY"
            value={birthdate}
            onChangeText={setBirthdate}
          />
        </View>

        {/* Nationality */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Nationality *</Text>
          <View className="border border-gray-300 rounded-xl overflow-hidden">
            <Picker
              selectedValue={nationality}
              onValueChange={setNationality}
              style={{ height: 50 }}
            >
              {NATIONALITIES.map((nat) => (
                <Picker.Item key={nat} label={nat} value={nat} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Source of Funds */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Source of Funds *</Text>
          <View className="border border-gray-300 rounded-xl overflow-hidden">
            <Picker
              selectedValue={sourceOfFunds}
              onValueChange={setSourceOfFunds}
              style={{ height: 50 }}
            >
              {SOURCE_OF_FUNDS.map((source) => (
                <Picker.Item key={source} label={source} value={source} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Current Address Section */}
        <Text className="text-lg font-bold text-gray-900 mb-4 mt-6">Current Address</Text>

        {/* Province */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Province *</Text>
          <View className="border border-gray-300 rounded-xl overflow-hidden">
            <Picker
              selectedValue={currentProvince}
              onValueChange={(value) => {
                setCurrentProvince(value);
                setCurrentCity(CITIES[value]?.[0] || '');
              }}
              style={{ height: 50 }}
            >
              {PROVINCES.map((prov) => (
                <Picker.Item key={prov} label={prov} value={prov} />
              ))}
            </Picker>
          </View>
        </View>

        {/* City/Municipality */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">City/Municipality *</Text>
          <View className="border border-gray-300 rounded-xl overflow-hidden">
            <Picker
              selectedValue={currentCity}
              onValueChange={setCurrentCity}
              style={{ height: 50 }}
            >
              {(CITIES[currentProvince] || []).map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Barangay */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Barangay *</Text>
          <View className="border border-gray-300 rounded-xl overflow-hidden">
            <Picker
              selectedValue={currentBarangay}
              onValueChange={setCurrentBarangay}
              style={{ height: 50 }}
            >
              {BARANGAYS.map((brgy) => (
                <Picker.Item key={brgy} label={brgy} value={brgy} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Zip Code */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Zip Code *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
            placeholder="Enter zip code"
            value={currentZipCode}
            onChangeText={setCurrentZipCode}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>

        {/* House Number and Street */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">House Number and Street Address *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
            placeholder="e.g., 123 Main Street"
            value={currentHouseStreet}
            onChangeText={setCurrentHouseStreet}
          />
        </View>

        {/* Permanent Address Section */}
        <Text className="text-lg font-bold text-gray-900 mb-4 mt-6">Permanent Address</Text>

        {/* Same as Current Address Checkbox */}
        <TouchableOpacity
          onPress={() => {
            setSameAsCurrentAddress(!sameAsCurrentAddress);
            if (!sameAsCurrentAddress) {
              setPermanentProvince(currentProvince);
              setPermanentCity(currentCity);
              setPermanentBarangay(currentBarangay);
              setPermanentZipCode(currentZipCode);
              setPermanentHouseStreet(currentHouseStreet);
            }
          }}
          className="flex-row items-center mb-4"
        >
          <View className={`w-6 h-6 border-2 rounded mr-3 items-center justify-center ${
            sameAsCurrentAddress ? 'bg-[#009245] border-[#009245]' : 'border-gray-300'
          }`}>
            {sameAsCurrentAddress && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text className="text-gray-700">Same as current address</Text>
        </TouchableOpacity>

        {!sameAsCurrentAddress && (
          <>
            {/* Permanent Province */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Province *</Text>
              <View className="border border-gray-300 rounded-xl overflow-hidden">
                <Picker
                  selectedValue={permanentProvince}
                  onValueChange={(value) => {
                    setPermanentProvince(value);
                    setPermanentCity(CITIES[value]?.[0] || '');
                  }}
                  style={{ height: 50 }}
                >
                  {PROVINCES.map((prov) => (
                    <Picker.Item key={prov} label={prov} value={prov} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Permanent City */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">City/Municipality *</Text>
              <View className="border border-gray-300 rounded-xl overflow-hidden">
                <Picker
                  selectedValue={permanentCity}
                  onValueChange={setPermanentCity}
                  style={{ height: 50 }}
                >
                  {(CITIES[permanentProvince] || []).map((city) => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Permanent Barangay */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Barangay *</Text>
              <View className="border border-gray-300 rounded-xl overflow-hidden">
                <Picker
                  selectedValue={permanentBarangay}
                  onValueChange={setPermanentBarangay}
                  style={{ height: 50 }}
                >
                  {BARANGAYS.map((brgy) => (
                    <Picker.Item key={brgy} label={brgy} value={brgy} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Permanent Zip Code */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Zip Code *</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
                placeholder="Enter zip code"
                value={permanentZipCode}
                onChangeText={setPermanentZipCode}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            {/* Permanent House Number and Street */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">House Number and Street Address *</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
                placeholder="e.g., 123 Main Street"
                value={permanentHouseStreet}
                onChangeText={setPermanentHouseStreet}
              />
            </View>
          </>
        )}

        {/* Proof of Billing Upload */}
        <Text className="text-lg font-bold text-gray-900 mb-4 mt-6">Documents</Text>
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Proof of Billing *</Text>
          <TouchableOpacity
            onPress={pickDocument}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center"
          >
            {proofOfBilling ? (
              <View className="items-center">
                <Ionicons name="document-text" size={40} color="#009245" />
                <Text className="text-sm text-gray-700 mt-2 text-center">{proofOfBilling.name}</Text>
                <Text className="text-xs text-gray-500 mt-1">Tap to change</Text>
              </View>
            ) : (
              <View className="items-center">
                <Ionicons name="cloud-upload-outline" size={40} color="#9CA3AF" />
                <Text className="text-sm text-gray-700 mt-2">Upload Proof of Billing</Text>
                <Text className="text-xs text-gray-500 mt-1">Utility bill, bank statement, etc.</Text>
              </View>
            )}
          </TouchableOpacity>
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
