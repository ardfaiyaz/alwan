import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function JoinGroupScreen() {
  const router = useRouter();
  const { allGroups, joinGroup, user } = useAuth();
  const [searchCode, setSearchCode] = useState('');

  const handleJoin = (groupId: string, groupName: string, currentMembers: number, maxMembers: number) => {
    console.log('[JoinGroup] handleJoin called');
    console.log('[JoinGroup] Group:', groupName, 'ID:', groupId);
    console.log('[JoinGroup] Current members:', currentMembers, '/', maxMembers);
    console.log('[JoinGroup] User:', user?.firstName, user?.lastName);

    if (currentMembers >= maxMembers) {
      console.log('[JoinGroup] Group is full - cannot join');
      Alert.alert('Group Full', 'This group has reached its maximum capacity of 15 members.');
      return;
    }

    console.log('[JoinGroup] Sending join request with solidarity lending commitment');

    Alert.alert(
      'Join Solidarity Group',
      `Join "${groupName}"?\n\nBy joining, you commit to:\n• Attend weekly center meetings\n• Support fellow members\n• Guarantee each other's loans\n• Make timely weekly payments\n• Build community together\n\nYour request will be sent to the group leader for approval.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join Group',
          onPress: () => {
            console.log('[JoinGroup] User confirmed - calling joinGroup()');
            joinGroup(groupId);
            console.log('[JoinGroup] Join request sent successfully');
            console.log('[JoinGroup] Redirecting to homepage');
            
            Alert.alert(
              'Request Sent!',
              'Your request to join has been sent to the group leader. You will be notified once approved.',
              [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
            );
          },
        },
      ]
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
          <Text className="text-2xl font-bold text-gray-900">Join a Group</Text>
          <Text className="text-sm text-gray-600 mt-2">
            Find and join a solidarity lending group
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Search by Code */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Have a Group Code?
            </Text>
            <View className="flex-row">
              <TextInput
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 mr-2"
                placeholder="Enter group code"
                value={searchCode}
                onChangeText={setSearchCode}
              />
              <TouchableOpacity className="bg-[#009245] px-6 py-3 rounded-xl items-center justify-center">
                <Text className="text-white font-semibold">Search</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="text-gray-500 text-sm mx-4">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Available Groups */}
          <Text className="text-base font-semibold text-gray-900 mb-4">
            Available Groups Near You
          </Text>

          {allGroups.map((group) => {
            const isFull = group.members.length >= group.maxMembers;
            const memberCount = group.members.length;
            
            return (
              <View
                key={group.id}
                className={`bg-white border-2 rounded-2xl p-4 mb-4 ${
                  isFull ? 'border-gray-200' : 'border-green-200'
                }`}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 mb-1">
                      {group.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Led by {group.leaderName}
                    </Text>
                  </View>
                  {isFull ? (
                    <View className="bg-gray-100 px-3 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-gray-600">Full</Text>
                    </View>
                  ) : (
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-green-700">Open</Text>
                    </View>
                  )}
                </View>

                <View className="space-y-2 mb-4">
                  <View className="flex-row items-center">
                    <Ionicons name="people" size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {memberCount}/{group.maxMembers} members
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="location" size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {group.centerLocation}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="calendar" size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {group.meetingDay}s at {group.meetingTime}
                    </Text>
                  </View>
                </View>

                {!isFull && (
                  <TouchableOpacity
                    onPress={() => handleJoin(group.id, group.name, memberCount, group.maxMembers)}
                    className="bg-[#009245] py-3 rounded-xl"
                  >
                    <Text className="text-white text-center font-semibold">
                      Request to Join
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {/* Info - KMBI Solidarity Lending */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <View className="flex-1 ml-3">
                <Text className="text-sm text-blue-900 font-semibold mb-1">
                  KMBI Solidarity Lending
                </Text>
                <Text className="text-sm text-blue-800 mb-2">
                  Join a group of 2-15 members who support each other through:
                </Text>
                <Text className="text-xs text-blue-800 mb-1">• Weekly center meetings for payments & education</Text>
                <Text className="text-xs text-blue-800 mb-1">• Mutual loan guarantees (members guarantee each other)</Text>
                <Text className="text-xs text-blue-800 mb-1">• Shared responsibility for timely repayment</Text>
                <Text className="text-xs text-blue-800">• Community support & financial empowerment</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
