import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RepaymentScreen() {
    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="bg-[#047857] pt-12 pb-8 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">Submit Repayment</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                <Text className="text-gray-800 text-lg font-bold mb-4">Select Amortization</Text>
                <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                    <Text className="text-gray-600 font-medium">Week 4 - Kabalikat Loan</Text>
                    <Text className="text-[#047857] text-2xl font-bold mt-1">P 2,000.00</Text>
                    <Text className="text-gray-400 text-xs mt-1">Due Date: April 04, 2026</Text>
                </View>

                <Text className="text-gray-800 text-lg font-bold mb-4">Payment Method</Text>
                <TouchableOpacity className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl mb-3 shadow-sm">
                    <Ionicons name="people" size={24} color="#047857" />
                    <Text className="text-gray-700 font-medium ml-3">Center Collection</Text>
                    <View className="flex-1" />
                    <Ionicons name="checkmark-circle" size={24} color="#047857" />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#047857] py-4 rounded-full items-center mt-8 shadow-lg"
                    onPress={() => {
                        alert('Repayment Submitted Successfully');
                        router.back();
                    }}
                >
                    <Text className="text-white font-bold text-lg">Confirm Payment</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
