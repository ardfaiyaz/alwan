import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TermsScreen() {
  const [accepted, setAccepted] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Purple Header */}
      <View className="bg-purple-600 pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Terms And Conditions</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Card */}
      <View className="flex-1 bg-white rounded-t-[40px] -mt-6 px-6 pt-8">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <Text className="text-gray-800 text-2xl font-bold mb-4">Terms and Conditions</Text>
          
          <Text className="text-gray-700 text-base mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>

          <Text className="text-gray-700 text-base mb-4">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </Text>

          <Text className="text-gray-700 text-base mb-4">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
            architecto beatae vitae dicta sunt explicabo.
          </Text>

          <Text className="text-gray-700 text-base mb-8">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
            consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </Text>

          {/* Checkbox */}
          <View className="flex-row items-start mb-8">
            <TouchableOpacity
              onPress={() => setAccepted(!accepted)}
              className={`w-6 h-6 border-2 rounded mr-3 mt-1 items-center justify-center ${
                accepted ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
              }`}
            >
              {accepted && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text className="text-gray-700 text-sm flex-1">
              I accept all the terms and conditions
            </Text>
          </View>

          {/* Accept Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            disabled={!accepted}
            className={`rounded-lg py-4 items-center mb-8 ${
              accepted ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <Text className={`text-lg font-bold ${accepted ? 'text-white' : 'text-gray-500'}`}>
              Accept
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
