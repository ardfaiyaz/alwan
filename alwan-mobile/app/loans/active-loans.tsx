import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LoansScreen() {
    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="bg-[#047857] pt-12 pb-8 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">My Loans</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                <Text className="text-gray-800 text-lg font-bold mb-4">Active Loan</Text>
                <View className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-gray-500 font-bold">Kabalikat Loan</Text>
                        <View className="bg-green-100 px-3 py-1 rounded-full">
                            <Text className="text-green-700 text-[10px] font-bold uppercase">Active</Text>
                        </View>
                    </View>
                    <Text className="text-[#047857] text-3xl font-bold">P 6,000.00</Text>
                    <Text className="text-gray-400 text-xs mt-1">Remaining from P 10,000 principal</Text>

                    <View className="mt-4 pt-4 border-t border-gray-50 flex-row justify-between">
                        <View>
                            <Text className="text-gray-400 text-[10px] uppercase">Next Pay</Text>
                            <Text className="text-gray-800 font-bold">Apr 04</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-gray-400 text-[10px] uppercase">Progress</Text>
                            <Text className="text-gray-800 font-bold">Week 4 / 25</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-purple-600 py-4 rounded-xl items-center shadow-lg"
                    onPress={() => alert('Loan documents appearing...')}
                >
                    <Text className="text-white font-bold">View Documents</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
