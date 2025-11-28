import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = COLORS.primary,
}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
