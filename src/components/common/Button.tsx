import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TEXT_STYLES } from '../../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    style,
}) => {
    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            ...styles.button,
            borderRadius: BORDER_RADIUS.md,
        };

        // Size styles
        const sizeStyles: Record<string, ViewStyle> = {
            small: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
            medium: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
            large: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl },
        };

        // Variant styles
        const variantStyles: Record<string, ViewStyle> = {
            primary: { backgroundColor: COLORS.primary },
            secondary: { backgroundColor: COLORS.secondary },
            danger: { backgroundColor: COLORS.emergency },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: COLORS.primary
            },
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
            opacity: disabled || loading ? 0.6 : 1,
        };
    };

    const getTextStyle = (): TextStyle => {
        const baseTextStyle: TextStyle = {
            ...TEXT_STYLES.button,
            textAlign: 'center',
        };

        const variantTextStyles: Record<string, TextStyle> = {
            primary: { color: '#FFFFFF' },
            secondary: { color: '#FFFFFF' },
            danger: { color: '#FFFFFF' },
            outline: { color: COLORS.primary },
        };

        return {
            ...baseTextStyle,
            ...variantTextStyles[variant],
        };
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? COLORS.primary : '#FFFFFF'} />
            ) : (
                <Text style={getTextStyle()}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
