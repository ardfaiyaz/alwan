import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function FingerprintScreen() {
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAdd = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowAdd(false);
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
              Fingerprint Has Been Changed Successfully
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (showAdd) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar style="light" />
        
        <View className="bg-purple-600 pt-12 pb-8 px-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => setShowAdd(false)}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Add Fingerprint</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <View className="flex-1 bg-white rounded-t-[40px] -mt-6 px-6 pt-8 items-center justify-center">
          <View className="w-32 h-32 bg-purple-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="finger-print" size={64} color="#7C3AED" />
          </View>
          <Text className="text-gray-800 text-xl font-semibold mb-4">Use Fingerprint To Access</Text>
          <Text className="text-gray-600 text-sm text-center mb-8 px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt.
          </Text>
          <TouchableOpacity
            onPress={handleAdd}
            className="bg-gray-300 rounded-lg py-4 px-8 w-full items-center"
          >
            <Text className="text-gray-700 text-lg font-bold">Use Touch Id</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mt-4">
            <Text className="text-gray-600 text-sm">Or use your password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showDelete) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar style="light" />
        
        <View className="bg-purple-600 pt-12 pb-8 px-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => setShowDelete(false)}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Jhon Fingerprint</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <View className="flex-1 bg-white rounded-t-[40px] -mt-6 px-6 pt-8 items-center justify-center">
          <View className="w-32 h-32 bg-purple-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="finger-print" size={64} color="#7C3AED" />
          </View>
          <Text className="text-gray-800 text-xl font-semibold mb-8">Jhon Fingerprint</Text>
          <TouchableOpacity
            onPress={() => {
              setShowDelete(false);
            }}
            className="bg-red-500 rounded-lg py-4 px-8 w-full items-center"
          >
            <Text className="text-white text-lg font-bold">Delete</Text>
          </TouchableOpacity>
        </View>
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
          <Text className="text-white text-xl font-bold">Fingerprint</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Card */}
      <View className="flex-1 bg-white rounded-t-[40px] -mt-6 px-6 pt-8">
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => setShowDelete(true)}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <Ionicons name="finger-print" size={24} color="#6B7280" />
              <Text className="text-gray-800 text-base ml-3">Jhon Fingerprint</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowAdd(true)}
            className="flex-row items-center justify-between py-4"
          >
            <View className="flex-row items-center">
              <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
              <Text className="text-gray-800 text-base ml-3">Add A Fingerprint</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
