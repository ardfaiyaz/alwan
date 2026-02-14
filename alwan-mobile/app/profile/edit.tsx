import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function EditProfileScreen() {
  const [username, setUsername] = useState('John Smith');
  const [phone, setPhone] = useState('+44 898 5055 08');
  const [email, setEmail] = useState('example@example.com');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Purple Header */}
      <View className="bg-purple-600 pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Edit My Profile</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Card */}
      <View className="flex-1 bg-white rounded-t-[40px] -mt-6 px-6 pt-8">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Picture */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-3">
              <Ionicons name="person" size={48} color="#9CA3AF" />
            </View>
            <Text className="text-gray-800 text-xl font-bold">John Smith</Text>
            <Text className="text-gray-500 text-sm">ID: 25080824</Text>
          </View>

          <Text className="text-gray-800 text-lg font-semibold mb-4">Account Settings</Text>

          {/* Username */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm mb-2">Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
            />
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm mb-2">Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
            />
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm mb-2">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
            />
          </View>

          {/* Toggles */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
              <Text className="text-gray-800 text-base">Push Notifications</Text>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#D1D5DB', true: '#7C3AED' }}
                thumbColor={pushNotifications ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>

            <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
              <Text className="text-gray-800 text-base">Turn Dark Theme</Text>
              <Switch
                value={darkTheme}
                onValueChange={setDarkTheme}
                trackColor={{ false: '#D1D5DB', true: '#7C3AED' }}
                thumbColor={darkTheme ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-900 rounded-lg py-4 items-center mb-8"
          >
            <Text className="text-white text-lg font-bold">Update Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
