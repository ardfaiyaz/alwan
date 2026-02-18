import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function GroupCenterScreen() {
  const { userGroup, user } = useAuth();

  const fieldOfficer = {
    name: 'Jose Reyes',
    phone: '09281234567',
  };

  const getNextMeetingDate = () => {
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDay = daysOfWeek.indexOf(userGroup?.meetingDay || 'Monday');
    const currentDay = today.getDay();
    
    let daysUntilMeeting = targetDay - currentDay;
    if (daysUntilMeeting <= 0) {
      daysUntilMeeting += 7;
    }
    
    const nextMeeting = new Date(today);
    nextMeeting.setDate(today.getDate() + daysUntilMeeting);
    return nextMeeting;
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  if (!userGroup) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="people-outline" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">No Group Yet</Text>
          <Text className="text-gray-600 text-center mb-6">
            You need to join or create a solidarity group to access this feature
          </Text>
          <TouchableOpacity className="bg-[#009245] px-6 py-3 rounded-xl">
            <Text className="text-white font-semibold">Join/Create Group</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const nextMeeting = getNextMeetingDate();
  const leaderInfo = userGroup.members.find(m => m.userId === userGroup.leaderId);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-[#009245] px-6 pt-8 pb-12">
          <Text className="text-white text-3xl font-bold mb-2">{userGroup.name}</Text>
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="rgba(255,255,255,0.8)" />
            <Text className="text-white/80 text-sm ml-1">{userGroup.centerLocation}</Text>
          </View>
        </View>

        <View className="px-4 -mt-6">
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-gray-500 text-xs font-semibold uppercase mb-3">GROUP LEADER</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-teal-700 font-bold text-xl">
                    {leaderInfo?.name.charAt(0) || 'A'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-lg">{userGroup.leaderName}</Text>
                  <Text className="text-gray-500 text-sm">{leaderInfo?.phoneNumber || '09171234567'}</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => handleCall(leaderInfo?.phoneNumber || '09171234567')}
                className="bg-[#009245] px-6 py-3 rounded-xl flex-row items-center"
              >
                <Ionicons name="call" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Call</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-gray-500 text-xs font-semibold uppercase mb-3">FIELD OFFICER</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-green-700 font-bold text-xl">
                    {fieldOfficer.name.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-lg">{fieldOfficer.name}</Text>
                  <Text className="text-gray-500 text-sm">{fieldOfficer.phone}</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => handleCall(fieldOfficer.phone)}
                className="bg-white border-2 border-[#009245] px-6 py-3 rounded-xl flex-row items-center"
              >
                <Ionicons name="call" size={18} color="#009245" />
                <Text className="text-[#009245] font-semibold ml-2">Call</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-amber-50 rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-start">
              <View className="w-12 h-12 bg-amber-200 rounded-xl items-center justify-center mr-3">
                <Ionicons name="calendar" size={24} color="#D97706" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-lg mb-1">Meeting Schedule</Text>
                <Text className="text-gray-900 font-bold text-xl mb-1">
                  {nextMeeting.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {userGroup.meetingTime} • {userGroup.centerLocation}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 font-bold text-xl">Members</Text>
              <Text className="text-gray-500 text-sm">{userGroup.members.length} members</Text>
            </View>

            {userGroup.members.map((member, index) => {
              const isPaid = Math.random() > 0.3;
              const colors = ['bg-purple-100', 'bg-blue-100', 'bg-pink-100', 'bg-green-100', 'bg-yellow-100'];
              const textColors = ['text-purple-700', 'text-blue-700', 'text-pink-700', 'text-green-700', 'text-yellow-700'];

              return (
                <View 
                  key={member.userId} 
                  className={`flex-row items-center justify-between py-4 ${
                    index !== userGroup.members.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <View className={`w-10 h-10 ${colors[index % colors.length]} rounded-full items-center justify-center mr-3`}>
                      <Text className={`${textColors[index % textColors.length]} font-bold text-base`}>
                        {member.name.charAt(0)}
                      </Text>
                    </View>
                    <Text className="text-gray-900 font-semibold text-base">{member.name}</Text>
                  </View>
                  <View className={`flex-row items-center px-3 py-1.5 rounded-full ${
                    isPaid ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <Ionicons 
                      name={isPaid ? 'checkmark-circle' : 'alert-circle'} 
                      size={16} 
                      color={isPaid ? '#10B981' : '#EF4444'} 
                    />
                    <Text className={`ml-1 text-sm font-semibold ${
                      isPaid ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isPaid ? 'Paid' : 'Overdue'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
