import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function EditProfileScreen() {
  const { profile, user, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      Alert.alert('Success', 'Profile updated successfully.');
      router.back();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* Alwan Green Header */}
      <View className="bg-[#047857] pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Edit My Profile</Text>
          <TouchableOpacity onPress={() => router.push('/profile/security')}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Card */}
      <View className="flex-1 bg-white rounded-t-[40px] -mt-6 px-6 pt-8">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Picture */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-emerald-50 rounded-full items-center justify-center mb-3">
              <Ionicons name="person" size={48} color="#047857" />
            </View>
            <Text className="text-gray-800 text-xl font-bold">{profile?.full_name || 'Member'}</Text>
            <Text className="text-gray-500 text-sm">
              {profile?.centers?.name || 'Alwan Community'} • {(profile?.role || 'Member').charAt(0).toUpperCase() + (profile?.role || 'Member').slice(1)}
            </Text>
          </View>

          <Text className="text-gray-800 text-lg font-semibold mb-4">Account Settings</Text>

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm mb-2">Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
            />
          </View>

          {/* Email (read-only from auth) */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm mb-2">Email Address</Text>
            <TextInput
              value={user?.email || ''}
              editable={false}
              className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-gray-500"
            />
            <Text className="text-gray-400 text-xs mt-1">Email can only be changed from Supabase Auth settings</Text>
          </View>

          {/* Business Info (read-only) */}
          {profile?.business_sector && (
            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2">Business Sector</Text>
              <TextInput
                value={profile.business_sector}
                editable={false}
                className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-gray-500"
              />
            </View>
          )}

          {/* Toggles */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
              <Text className="text-gray-800 text-base">Push Notifications</Text>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#D1D5DB', true: '#047857' }}
                thumbColor={pushNotifications ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>

            <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
              <Text className="text-gray-800 text-base">Turn Dark Theme</Text>
              <Switch
                value={darkTheme}
                onValueChange={setDarkTheme}
                trackColor={{ false: '#D1D5DB', true: '#047857' }}
                thumbColor={darkTheme ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            onPress={handleUpdateProfile}
            disabled={isSaving}
            className={`bg-[#047857] rounded-lg py-4 items-center mb-8 ${isSaving ? 'opacity-50' : ''}`}
          >
            <Text className="text-white text-lg font-bold">{isSaving ? 'Saving...' : 'Update Profile'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
