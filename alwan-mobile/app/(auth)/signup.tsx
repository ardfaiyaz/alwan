import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import ErrorModal from '../../components/ui/ErrorModal';

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
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorVisible(true);
  };

  const handleSignup = async () => {
    // 1. Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      showError('Please fill in all required fields (Name, Email, Password).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // 2. Sign Up with Supabase Auth
      const { data: { session, user }, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (authError) throw authError;
      if (!user) throw new Error('No user created');

      // 3. Create Profile
      // giving initial CBU balance of 5000 so they can test loans immediately
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          cbu_balance: 5000,
          // center_id: ... in a real app we'd assign this
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Note: User is created in Auth but Profile failed. 
        // In a production app you might want to rollback or retry.
        showError('Account created but profile setup failed. Please contact support.');
      } else {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      }

    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
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

            {/* ... other address fields ... */}

            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              className={`bg-teal-700 rounded-lg py-4 items-center mb-6 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-bold">Sign Up</Text>
              )}
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

      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
}
