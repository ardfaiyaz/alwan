import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const onboardingData = [
  {
    id: 1,
    title: 'Split Your Bill In 3 Or 6 Monthly Installment',
    illustration: '💰',
  },
  {
    id: 2,
    title: 'Are You Ready To Take Control Of Your Finances?',
    illustration: '📊',
  },
  {
    id: 3,
    title: 'Loan Up To $5,000 With As Low As 1% Interest',
    illustration: '💵',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/launch');
    }
  };

  const currentSlide = onboardingData[currentIndex];

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#7C3AED', '#7C3AED']}
        className="flex-1"
      >
        <View className="pt-16 px-6 pb-4">
          <Text className="text-white text-2xl font-bold text-center">
            {currentSlide.title}
          </Text>
        </View>

        <View className="flex-1 bg-white rounded-t-[40px] mt-8 px-6 pt-8">
          <View className="flex-1 items-center justify-center">
            <View className="w-64 h-64 items-center justify-center mb-8">
              <Text className="text-8xl">{currentSlide.illustration}</Text>
            </View>
          </View>

          <View className="pb-8">
            <TouchableOpacity
              onPress={handleNext}
              className="bg-purple-600 rounded-full py-4 px-8 items-center mb-4"
            >
              <Text className="text-white text-xl font-bold">Next</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center gap-2">
              {onboardingData.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-purple-600' : 'bg-purple-300'
                  }`}
                />
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
