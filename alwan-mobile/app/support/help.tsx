import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HelpScreen() {
    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="bg-[#047857] pt-12 pb-8 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">Help Center</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                <Text className="text-gray-800 text-lg font-bold mb-6">How can we help you?</Text>

                <TouchableOpacity className="bg-white border border-emerald-50 p-6 rounded-2xl shadow-sm mb-4 flex-row items-center">
                    <Ionicons name="call-outline" size={32} color="#047857" />
                    <View className="ml-4">
                        <Text className="text-gray-800 font-bold">Call Support</Text>
                        <Text className="text-gray-400 text-xs">Available 9am - 5pm</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="bg-white border border-emerald-50 p-6 rounded-2xl shadow-sm mb-4 flex-row items-center">
                    <Ionicons name="chatbubble-ellipses-outline" size={32} color="#047857" />
                    <View className="ml-4">
                        <Text className="text-gray-800 font-bold">Chat with Us</Text>
                        <Text className="text-gray-400 text-xs">Response time: ~10 mins</Text>
                    </View>
                </TouchableOpacity>

                <Text className="text-gray-800 text-lg font-bold mt-8 mb-4">FAQs</Text>
                <TouchableOpacity className="p-4 border-b border-gray-50 flex-row justify-between items-center">
                    <Text className="text-gray-600">How to increase loan limit?</Text>
                    <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
