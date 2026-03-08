import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function GroupCenterScreen() {
  const router = useRouter();
  const { userGroup } = useAuth();

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
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="bg-[#009245] px-6 pt-8 pb-12">
            <Text className="text-white text-3xl font-bold mb-2">Center</Text>
            <Text className="text-white/80 text-sm">Join or create your solidarity group</Text>
          </View>

          <View className="px-6 -mt-6">
            {/* Empty State Card */}
            <View className="bg-white rounded-2xl p-8 mb-4 shadow-sm items-center">
              <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="people" size={48} color="#009245" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                No Group Yet
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                Join an existing solidarity group or create your own to start your microfinance journey
              </Text>
            </View>

            {/* Info Card */}
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
              <View className="flex-row items-start mb-3">
                <Ionicons name="information-circle" size={24} color="#3B82F6" />
                <View className="flex-1 ml-3">
                  <Text className="text-blue-900 font-semibold mb-2">
                    About Solidarity Groups
                  </Text>
                  <Text className="text-blue-800 text-sm mb-2">
                    KMBI uses solidarity lending where groups of 2-15 members support each other:
                  </Text>
                  <Text className="text-blue-800 text-xs mb-1">• Weekly center meetings</Text>
                  <Text className="text-blue-800 text-xs mb-1">• Members guarantee each other's loans</Text>
                  <Text className="text-blue-800 text-xs mb-1">• Shared responsibility for repayment</Text>
                  <Text className="text-blue-800 text-xs mb-1">• Financial education & support</Text>
                  <Text className="text-blue-800 text-xs">• Access to savings & insurance</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
              <TouchableOpacity
                onPress={() => router.push('/loans/join-group')}
                className="bg-[#009245] py-4 rounded-xl flex-row items-center justify-center"
              >
                <Ionicons name="enter" size={24} color="white" />
                <Text className="text-white text-base font-semibold ml-2">
                  Join Group
                </Text>
              </TouchableOpacity>
            </View>

            {/* Benefits Section */}
            <View className="mt-6 mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Benefits of Joining
              </Text>

              <View className="bg-white rounded-2xl p-5 mb-3 shadow-sm">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center mr-3">
                    <Ionicons name="cash" size={24} color="#8B5CF6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base mb-1">
                      Access to Microloans
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Get loans from ₱3,000 to ₱50,000 for business, education, or emergencies
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-white rounded-2xl p-5 mb-3 shadow-sm">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mr-3">
                    <Ionicons name="people" size={24} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base mb-1">
                      Community Support
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Build relationships with fellow entrepreneurs and support each other
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-white rounded-2xl p-5 mb-3 shadow-sm">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-3">
                    <Ionicons name="school" size={24} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base mb-1">
                      Financial Education
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Learn budgeting, saving, and business management skills
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-white rounded-2xl p-5 shadow-sm">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-yellow-100 rounded-xl items-center justify-center mr-3">
                    <Ionicons name="shield-checkmark" size={24} color="#F59E0B" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base mb-1">
                      Insurance Coverage
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Affordable microinsurance to protect you and your family
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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
              // Assign payment status based on index for variety
              let paymentStatus: 'paid' | 'due' | 'overdue';
              if (index % 3 === 0) {
                paymentStatus = 'paid';
              } else if (index % 3 === 1) {
                paymentStatus = 'overdue';
              } else {
                paymentStatus = 'due';
              }

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
                    paymentStatus === 'paid' ? 'bg-green-100' : 
                    paymentStatus === 'overdue' ? 'bg-red-100' : 
                    'bg-yellow-100'
                  }`}>
                    <Ionicons 
                      name={
                        paymentStatus === 'paid' ? 'checkmark-circle' : 
                        paymentStatus === 'overdue' ? 'alert-circle' : 
                        'time'
                      } 
                      size={16} 
                      color={
                        paymentStatus === 'paid' ? '#10B981' : 
                        paymentStatus === 'overdue' ? '#EF4444' : 
                        '#F59E0B'
                      } 
                    />
                    <Text className={`ml-1 text-sm font-semibold ${
                      paymentStatus === 'paid' ? 'text-green-700' : 
                      paymentStatus === 'overdue' ? 'text-red-700' : 
                      'text-yellow-700'
                    }`}>
                      {paymentStatus === 'paid' ? 'Paid' : 
                       paymentStatus === 'overdue' ? 'Overdue' : 
                       'Due'}
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
