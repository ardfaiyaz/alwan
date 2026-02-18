import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { createGroup, user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [centerLocation, setCenterLocation] = useState('');
  const [meetingDay, setMeetingDay] = useState('');
  const [meetingTime, setMeetingTime] = useState('');

  const handleCreate = () => {
    console.log('[CreateGroup] handleCreate called');
    console.log('[CreateGroup] Form data:', { groupName, centerLocation, meetingDay, meetingTime });

    if (!groupName || !centerLocation || !meetingDay || !meetingTime) {
      console.log('[CreateGroup] Validation failed - missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('[CreateGroup] Creating group with KMBI solidarity lending model');
    console.log('[CreateGroup] Group will support 2-15 members with weekly meetings');

    createGroup({
      name: groupName,
      centerLocation,
      meetingDay,
      meetingTime,
      maxMembers: 15,
    });

    console.log('[CreateGroup] Group created successfully');
    console.log('[CreateGroup] User is now group leader:', user?.firstName, user?.lastName);
    console.log('[CreateGroup] Redirecting to homepage');

    Alert.alert(
      'Group Created Successfully!',
      `Your solidarity lending group "${groupName}" has been created.\n\nAs group leader, you will:\n• Coordinate weekly meetings at ${centerLocation}\n• Support members with their loans\n• Collect weekly payments\n• Maintain group solidarity\n\nShare your group code with 1-14 more members to complete your group.`,
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Create a Group</Text>
          <Text className="text-sm text-gray-600 mt-2">
            Start a solidarity lending group
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Info Card - KMBI Solidarity Lending Model */}
          <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#009245" />
              <View className="flex-1 ml-3">
                <Text className="text-green-900 font-semibold mb-2">
                  KMBI Solidarity Lending Model
                </Text>
                <Text className="text-green-800 text-sm mb-2">
                  Create a group of 2-15 members who support each other:
                </Text>
                <Text className="text-green-800 text-xs mb-1">• Weekly center meetings for payments & support</Text>
                <Text className="text-green-800 text-xs mb-1">• Members guarantee each other's loans</Text>
                <Text className="text-green-800 text-xs mb-1">• Shared responsibility for repayment</Text>
                <Text className="text-green-800 text-xs mb-1">• Financial education & community building</Text>
                <Text className="text-green-800 text-xs">• Access to savings & insurance programs</Text>
              </View>
            </View>
          </View>

          {/* Group Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Group Name
            </Text>
            <TextInput
              className="border-2 border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholder="e.g., Sampaguita Group"
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>

          {/* Center Location */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Center Location
            </Text>
            <TextInput
              className="border-2 border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholder="e.g., Barangay Hall, Brgy. San Jose"
              value={centerLocation}
              onChangeText={setCenterLocation}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Where will your group meet weekly?
            </Text>
          </View>

          {/* Meeting Day */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Meeting Day
            </Text>
            <View className="flex-row flex-wrap -mx-1">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => setMeetingDay(day)}
                  className={`m-1 px-4 py-2 rounded-lg ${
                    meetingDay === day ? 'bg-[#009245]' : 'bg-gray-100'
                  }`}
                >
                  <Text className={`text-sm font-semibold ${
                    meetingDay === day ? 'text-white' : 'text-gray-700'
                  }`}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Meeting Time */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Meeting Time
            </Text>
            <TextInput
              className="border-2 border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholder="e.g., 9:00 AM"
              value={meetingTime}
              onChangeText={setMeetingTime}
            />
          </View>

          {/* Group Responsibilities */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <Text className="font-semibold text-gray-900 mb-2">
              As Group Leader, you will:
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  Coordinate weekly center meetings
                </Text>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  Collect and submit weekly payments
                </Text>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  Support members with their loans
                </Text>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
                <Text className="flex-1 text-sm text-gray-700 ml-2">
                  Maintain group solidarity
                </Text>
              </View>
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleCreate}
            disabled={!groupName || !centerLocation || !meetingDay || !meetingTime}
            className={`py-4 rounded-xl ${
              groupName && centerLocation && meetingDay && meetingTime
                ? 'bg-[#009245]'
                : 'bg-gray-300'
            }`}
          >
            <Text className="text-white text-center text-base font-semibold">
              Create Group
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
