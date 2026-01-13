import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onPress,
  disabled = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'warning':
        return 'bg-warning';
      case 'danger':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg ${getVariantClasses()} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Text className={`text-${variant}-foreground text-center font-medium`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
