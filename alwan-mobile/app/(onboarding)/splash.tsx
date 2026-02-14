import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#84CC16', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 items-center justify-center"
      >
        <View className="items-center">
          <View className="w-24 h-24 items-center justify-center mb-4">
            <View className="w-20 h-20 border-4 border-white rounded-lg items-center justify-center">
              <View className="w-12 h-1 bg-white" />
            </View>
          </View>
          <Text className="text-white text-4xl font-bold">ALWAN</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
