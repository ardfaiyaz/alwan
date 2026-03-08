import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login-phone');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-[#009245] items-center justify-center">
      <Animated.View entering={FadeIn.duration(1000)}>
        <Text className="text-white text-4xl font-bold">ALWAN</Text>
        <Text className="text-white/80 text-sm text-center mt-2">KMBI Microfinance</Text>
      </Animated.View>
    </View>
  );
}
