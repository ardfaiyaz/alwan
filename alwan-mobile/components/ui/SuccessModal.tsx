import React from 'react';
import { Modal, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessModalProps {
    visible: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

export default function SuccessModal({ visible, title = 'Success!', message, onClose }: SuccessModalProps) {
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
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/60 justify-center items-center px-6">
                <Animated.View
                    className="w-full max-w-sm bg-white rounded-[32px] p-8 items-center shadow-2xl"
                    style={{
                        transform: [{ scale: animation }],
                        elevation: 10,
                        borderWidth: 1,
                        borderColor: '#F3F4F6'
                    }}
                >
                    <View className="w-20 h-20 rounded-full items-center justify-center mb-6 shadow-sm bg-emerald-50">
                        <View className="w-14 h-14 bg-emerald-100 rounded-full items-center justify-center">
                            <Ionicons name="checkmark-sharp" size={32} color="#059669" />
                        </View>
                    </View>

                    <Text className="text-2xl font-bold text-[#111827] mb-3 text-center tracking-tight">{title}</Text>
                    <Text className="text-[#4B5563] text-center text-base mb-10 leading-6 px-2">{message}</Text>

                    <TouchableOpacity
                        className="bg-[#047857] w-full py-4 rounded-2xl items-center shadow-sm active:opacity-90"
                        onPress={onClose}
                    >
                        <Text className="text-white font-bold text-lg tracking-wide">Continue</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}
