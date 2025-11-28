import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { useTheme } from '../../theme/useTheme';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
    const { colors } = useTheme();
    return <View style={[styles.card, { backgroundColor: colors.card }, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        ...SHADOWS.md,
    },
});
