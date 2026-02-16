import React from 'react';
import { Modal, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export default function ConfirmModal({
    visible,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isDestructive = false
}: ConfirmModalProps) {
    const [animation] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        if (visible) {
            Animated.spring(animation, {
                toValue: 1,
                useNativeDriver: true,
                tension: 50,
                friction: 7
            }).start();
        } else {
            animation.setValue(0);
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/60 justify-center items-center px-6">
                <Animated.View
                    className="w-full max-w-sm rounded-[32px] p-8 items-center shadow-2xl"
                    style={{
                        transform: [{ scale: animation }],
                        backgroundColor: '#FFFFFF',
                        elevation: 10,
                        borderWidth: 1,
                        borderColor: '#F3F4F6'
                    }}
                >
                    <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 shadow-sm ${isDestructive ? 'bg-red-50' : 'bg-emerald-50'}`}>
                        <View className={`w-14 h-14 rounded-full items-center justify-center ${isDestructive ? 'bg-red-100' : 'bg-emerald-100'}`}>
                            <Ionicons
                                name={isDestructive ? 'trash-outline' : 'help-outline'}
                                size={32}
                                color={isDestructive ? '#EF4444' : '#059669'}
                            />
                        </View>
                    </View>

                    <Text className="text-2xl font-bold text-[#111827] mb-3 text-center tracking-tight">{title}</Text>
                    <Text className="text-[#4B5563] text-center text-base mb-10 leading-6 px-2">{message}</Text>

                    <View className="w-full space-y-3">
                        <TouchableOpacity
                            className={`w-full py-4 rounded-2xl items-center shadow-md active:opacity-90 ${isDestructive ? 'bg-[#EF4444]' : 'bg-[#047857]'}`}
                            onPress={onConfirm}
                        >
                            <Text className="text-white font-bold text-lg tracking-wide">{confirmText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full py-4 rounded-2xl items-center active:bg-gray-50 mt-1"
                            onPress={onCancel}
                        >
                            <Text className="text-[#6B7280] font-semibold text-base">{cancelText}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
