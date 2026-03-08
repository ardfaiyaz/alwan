import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { COLORS } from '@/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  className = '',
}) => {
  const getVariantStyles = () => {
    if (disabled) return 'bg-gray-300';
    
    switch (variant) {
      case 'primary':
        return 'bg-[#009245]';
      case 'secondary':
        return 'bg-gray-600';
      case 'outline':
        return 'bg-transparent border-2 border-[#009245]';
      default:
        return 'bg-[#009245]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4';
      case 'md':
        return 'py-4 px-6';
      case 'lg':
        return 'py-5 px-8';
      default:
        return 'py-4 px-6';
    }
  };

  const getTextColor = () => {
    if (disabled) return 'text-gray-500';
    if (variant === 'outline') return 'text-[#009245]';
    return 'text-white';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-xl ${getVariantStyles()} ${getSizeStyles()} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary.main : 'white'} />
      ) : (
        <Text className={`text-center text-base font-semibold ${getTextColor()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
