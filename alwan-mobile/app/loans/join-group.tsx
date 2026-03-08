import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function JoinGroupScreen() {
  const router = useRouter();
  const { joinGroup, user } = useAuth();
  const [groupCode, setGroupCode] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

  const handleJoinClick = () => {
    if (!groupCode.trim()) {
      Alert.alert('Error', 'Please enter a group code');
      return;
    }
    // Show terms modal
    setShowTermsModal(true);
  };

  const handleAcceptTerms = () => {
    if (!agreedToTerms || !agreedToRules) {
      Alert.alert('Agreement Required', 'Please agree to both Terms & Conditions and Rules & Regulations to continue.');
      return;
    }

    console.log('[JoinGroup] Joining group with code:', groupCode);
    console.log('[JoinGroup] User:', user?.firstName, user?.lastName);

    // Join the group using the code
    joinGroup(groupCode.trim());

    console.log('[JoinGroup] Successfully joined group');
    
    // Close modal and redirect
    setShowTermsModal(false);
    router.replace('/(tabs)/center');
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
            Enter your group code to join
          </Text>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Info Card */}
          <View className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#009245" />
              <View className="flex-1 ml-3">
                <Text className="text-green-900 font-semibold mb-2">
                  How to Join
                </Text>
                <Text className="text-green-800 text-sm mb-2">
                  Ask your group leader for the group code and enter it below to join instantly.
                </Text>
                <Text className="text-green-800 text-xs">
                  Example codes: QWERTY, ABC123, SAMPAGUITA
                </Text>
              </View>
            </View>
          </View>

          {/* Group Code Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Group Code
            </Text>
            <TextInput
              className="border-2 border-gray-300 rounded-xl px-4 py-4 text-lg text-gray-900 text-center font-semibold uppercase"
              placeholder="Enter group code"
              value={groupCode}
              onChangeText={(text) => setGroupCode(text.toUpperCase())}
              autoCapitalize="characters"
              maxLength={20}
            />
            <Text className="text-xs text-gray-500 mt-2 text-center">
              Enter any code provided by your group leader
            </Text>
          </View>

          {/* Join Button */}
          <TouchableOpacity
            onPress={handleJoinClick}
            disabled={!groupCode.trim()}
            className={`py-4 rounded-xl ${
              groupCode.trim() ? 'bg-[#009245]' : 'bg-gray-300'
            }`}
          >
            <Text className="text-white text-center text-base font-semibold">
              Join Group
            </Text>
          </TouchableOpacity>

          {/* Benefits Section */}
          <View className="mt-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              What Happens Next?
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-green-700 font-bold">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">
                    Instant Access
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    You'll immediately join the group and see member details
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-green-700 font-bold">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">
                    View Meeting Schedule
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Check when and where your weekly center meetings are held
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-green-700 font-bold">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">
                    Connect with Members
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Contact your group leader and fellow members
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-green-700 font-bold">4</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">
                    Start Your Journey
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Apply for loans and access KMBI services
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Solidarity Info */}
          <View className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mt-6">
            <View className="flex-row items-start">
              <Ionicons name="people" size={24} color="#3B82F6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-900 font-semibold mb-2">
                  Solidarity Lending
                </Text>
                <Text className="text-blue-800 text-sm mb-2">
                  As a group member, you commit to:
                </Text>
                <Text className="text-blue-800 text-xs mb-1">• Attend weekly center meetings</Text>
                <Text className="text-blue-800 text-xs mb-1">• Support fellow members</Text>
                <Text className="text-blue-800 text-xs mb-1">• Make timely weekly payments</Text>
                <Text className="text-blue-800 text-xs">• Build community together</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Terms & Conditions Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[90%]">
            <View className="px-6 pt-6 pb-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-2xl font-bold text-gray-900">Terms & Conditions</Text>
                <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                  <Ionicons name="close" size={28} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-600">
                Please read and agree to continue
              </Text>
            </View>

            <ScrollView className="px-6 py-4" style={{ maxHeight: 400 }}>
              {/* Terms & Conditions Section */}
              <View className="mb-6">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="document-text" size={24} color="#009245" />
                  <Text className="text-lg font-bold text-gray-900 ml-2">
                    Terms & Conditions
                  </Text>
                </View>
                <Text className="text-gray-700 text-sm leading-6 mb-2">
                  By joining a KMBI solidarity group, you agree to the following terms:
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • You are responsible for your own loan repayment obligations
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • You understand the solidarity lending model and mutual guarantee system
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • You agree to attend mandatory weekly center meetings
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • You consent to the collection and processing of your personal data
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • You acknowledge that loan approval is subject to KMBI's assessment
                </Text>
                <Text className="text-gray-700 text-sm leading-6">
                  • You agree to pay applicable interest rates and service fees
                </Text>
              </View>

              {/* Rules & Regulations Section */}
              <View className="mb-4">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
                  <Text className="text-lg font-bold text-gray-900 ml-2">
                    Rules & Regulations
                  </Text>
                </View>
                <Text className="text-gray-700 text-sm leading-6 mb-2">
                  As a member, you must follow these rules:
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • Make weekly payments on time at center meetings
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • Support fellow group members in their financial journey
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • Maintain respectful and honest communication
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • Notify your group leader of any payment difficulties in advance
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • Use loan funds for stated purposes only
                </Text>
                <Text className="text-gray-700 text-sm leading-6 mb-1">
                  • Participate actively in group activities and financial literacy training
                </Text>
                <Text className="text-gray-700 text-sm leading-6">
                  • Report any changes to your contact information immediately
                </Text>
              </View>

              {/* Important Notice */}
              <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <View className="flex-row items-start">
                  <Ionicons name="warning" size={20} color="#F59E0B" />
                  <Text className="flex-1 text-amber-900 text-xs ml-2 leading-5">
                    Failure to comply with these terms and rules may result in loan denial, 
                    suspension of services, or removal from the group.
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Agreement Checkboxes */}
            <View className="px-6 py-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                className="flex-row items-start mb-3"
              >
                <View className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 mt-0.5 ${
                  agreedToTerms ? 'bg-[#009245] border-[#009245]' : 'border-gray-300'
                }`}>
                  {agreedToTerms && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text className="flex-1 text-gray-700 text-sm">
                  I have read and agree to the Terms & Conditions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAgreedToRules(!agreedToRules)}
                className="flex-row items-start mb-4"
              >
                <View className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 mt-0.5 ${
                  agreedToRules ? 'bg-[#009245] border-[#009245]' : 'border-gray-300'
                }`}>
                  {agreedToRules && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text className="flex-1 text-gray-700 text-sm">
                  I have read and agree to the Rules & Regulations
                </Text>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setShowTermsModal(false)}
                  className="flex-1 bg-gray-200 py-3 rounded-xl mr-2"
                >
                  <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAcceptTerms}
                  disabled={!agreedToTerms || !agreedToRules}
                  className={`flex-1 py-3 rounded-xl ml-2 ${
                    agreedToTerms && agreedToRules ? 'bg-[#009245]' : 'bg-gray-300'
                  }`}
                >
                  <Text className="text-white text-center font-semibold">Accept & Join</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
