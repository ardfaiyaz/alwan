import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';

interface PinInputProps {
  length: number;
  value: string[];
  onChange: (value: string[]) => void;
  secureTextEntry?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  length,
  value,
  onChange,
  secureTextEntry = false,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    
    const newValue = [...value];
    newValue[index] = text;
    onChange(newValue);

    // Auto focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className="w-14 h-14 border-2 border-gray-300 rounded-xl text-center text-2xl font-bold text-gray-900"
          keyboardType="number-pad"
          maxLength={1}
          value={value[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          secureTextEntry={secureTextEntry}
        />
      ))}
    </View>
  );
};
