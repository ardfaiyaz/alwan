import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    barangay: '',
    city: '',
    province: '',
    houseNo: '',
    postalCode: '',
    day: '',
    month: '',
    year: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

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
          <Text className="text-white text-3xl font-bold text-center">Create Account</Text>
        </View>

        <View className="flex-1 bg-white rounded-t-[40px] mt-8">
          <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2">First Name</Text>
                <TextInput
                  placeholder="John"
                  value={formData.firstName}
                  onChangeText={(value) => updateField('firstName', value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2">Last Name</Text>
                <TextInput
                  placeholder="Smith"
                  value={formData.lastName}
                  onChangeText={(value) => updateField('lastName', value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2">Email</Text>
              <TextInput
                placeholder="example@example.com"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2">Phone Number</Text>
              <TextInput
                placeholder="+123 456 789"
                value={formData.phoneNumber}
                onChangeText={(value) => updateField('phoneNumber', value)}
                keyboardType="phone-pad"
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2">Password</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center">
                <TextInput
                  placeholder="Enter password"
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  secureTextEntry={!showPassword}
                  className="text-gray-800 flex-1"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2">Confirm Password</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center">
                <TextInput
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateField('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  className="text-gray-800 flex-1"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-gray-700 text-lg font-semibold mb-4 mt-2">Full Address</Text>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2">Barangay</Text>
              <TextInput
                placeholder="Enter barangay"
                value={formData.barangay}
                onChangeText={(value) => updateField('barangay', value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2">City/Municipality</Text>
                <TextInput
                  placeholder="City"
                  value={formData.city}
                  onChangeText={(value) => updateField('city', value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2">Province</Text>
                <TextInput
                  placeholder="Province"
                  value={formData.province}
                  onChangeText={(value) => updateField('province', value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>
            </View>

            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2">House/Building No.</Text>
                <TextInput
                  placeholder="123"
                  value={formData.houseNo}
                  onChangeText={(value) => updateField('houseNo', value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2">Postal Code</Text>
                <TextInput
                  placeholder="12345"
                  value={formData.postalCode}
                  onChangeText={(value) => updateField('postalCode', value)}
                  keyboardType="number-pad"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>
            </View>

            <Text className="text-gray-700 text-sm mb-2">Birthday</Text>
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <TextInput
                  placeholder="Day"
                  value={formData.day}
                  onChangeText={(value) => updateField('day', value)}
                  keyboardType="number-pad"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="Month"
                  value={formData.month}
                  onChangeText={(value) => updateField('month', value)}
                  keyboardType="number-pad"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="Year"
                  value={formData.year}
                  onChangeText={(value) => updateField('year', value)}
                  keyboardType="number-pad"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2">Upload valid ID</Text>
              <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg p-8 items-center">
                <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
                <Text className="text-gray-600 mt-2">Upload ID</Text>
                <Text className="text-gray-400 text-xs mt-1">Max 5MB (JPEG, PNG, PDF). PDF only.</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-6">
              <TouchableOpacity className="w-5 h-5 border-2 border-gray-300 rounded mr-2" />
              <Text className="text-gray-600 text-sm flex-1">
                By continuing, you agree to our Terms of Use and Privacy Policy.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              className="bg-teal-700 rounded-lg py-4 items-center mb-6"
            >
              <Text className="text-white text-lg font-bold">Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/login')}
              className="items-center pb-8"
            >
              <Text className="text-gray-600 text-sm">
                Already have an account? <Text className="text-purple-600 font-semibold">Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}
