import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LedgerScreen() {
    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="bg-[#047857] pt-12 pb-8 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">Payment Ledger</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                <Text className="text-gray-800 text-lg font-bold mb-4">Transaction History</Text>
                {[1, 2, 3, 4].map((week) => (
                    <View key={week} className="flex-row items-center justify-between p-4 border-b border-gray-50">
                        <View>
                            <Text className="text-gray-800 font-bold">Week {week} Payment</Text>
                            <Text className="text-gray-400 text-xs">Verified by Center Leader</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-gray-800 font-bold">P 2,000.00</Text>
                            <Text className="text-[#047857] text-[10px] font-bold uppercase">Success</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
