import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


interface ErrorModalProps {
    visible: boolean;
    message: string;
    onClose: () => void;
}

export default function ErrorModal({ visible, message, onClose }: ErrorModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-center items-center bg-black/60 px-6">
                    <TouchableWithoutFeedback>
                        <View
                            className="bg-white w-full max-w-sm rounded-[32px] p-8 items-center shadow-2xl"
                            style={{ elevation: 10, borderWidth: 1, borderColor: '#F3F4F6' }}
                        >
                            <View className="w-20 h-20 rounded-full items-center justify-center mb-6 shadow-sm bg-red-50">
                                <View className="w-14 h-14 bg-red-100 rounded-full items-center justify-center">
                                    <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
                                </View>
                            </View>

                            <Text className="text-2xl font-bold text-[#111827] mb-3 text-center tracking-tight">
                                Error
                            </Text>

                            <Text className="text-[#4B5563] text-center text-base mb-10 leading-6 px-2">
                                {message}
                            </Text>

                            <TouchableOpacity
                                onPress={onClose}
                                className="w-full bg-[#EF4444] py-3 rounded-2xl items-center shadow-sm active:opacity-90"
                            >
                                <Text className="text-white font-bold text-lg tracking-wide">
                                    Dismiss
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
