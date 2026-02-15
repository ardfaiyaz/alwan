import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function CBUScreen() {
    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="bg-[#047857] pt-12 pb-8 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">CBU Savings</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                <View className="bg-emerald-50 p-6 rounded-2xl items-center mb-8">
                    <Text className="text-gray-500 font-medium uppercase tracking-wider">Total CBU Balance</Text>
                    <Text className="text-[#047857] text-4xl font-bold mt-2">P 3,500.00</Text>
                </View>

                <Text className="text-gray-800 text-lg font-bold mb-4">Add Capital</Text>
                <TouchableOpacity className="bg-white border border-dashed border-[#047857] p-8 rounded-2xl items-center mb-6">
                    <Ionicons name="add-circle-outline" size={40} color="#047857" />
                    <Text className="text-[#047857] font-bold mt-2">Deposit to CBU</Text>
                </TouchableOpacity>

                <Text className="text-gray-800 text-lg font-bold mb-4">Recent Activity</Text>
                <View className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <View className="flex-row justify-between p-4 border-b border-gray-50">
                        <View>
                            <Text className="text-gray-800 font-medium">Automatic CBU</Text>
                            <Text className="text-gray-400 text-xs">Feb 12, 2026</Text>
                        </View>
                        <Text className="text-green-600 font-bold">+P 500.00</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
