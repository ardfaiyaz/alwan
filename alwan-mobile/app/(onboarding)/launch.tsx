import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function LaunchScreen() {
  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#84CC16', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 items-center justify-center px-6"
      >
        <View className="items-center mb-16">
          <View className="w-24 h-24 items-center justify-center mb-4">
            <View className="w-20 h-20 border-4 border-white rounded-lg items-center justify-center">
              <View className="w-12 h-1 bg-white" />
            </View>
          </View>
          <Text className="text-white text-4xl font-bold">ALWAN</Text>
        </View>

        <View className="w-full gap-4">
          <TouchableOpacity
            onPress={() => router.push('/signup')}
            className="bg-white rounded-full py-4 px-8 items-center"
          >
            <Text className="text-purple-600 text-lg font-bold">Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/login')}
            className="bg-purple-600 rounded-full py-4 px-8 items-center"
          >
            <Text className="text-white text-lg font-bold">Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/forgot-password')}
            className="mt-2"
          >
            <Text className="text-white/70 text-sm text-center">forgot password?</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
