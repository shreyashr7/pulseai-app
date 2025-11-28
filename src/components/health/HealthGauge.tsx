import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { COLORS, SPACING, TEXT_STYLES } from '../../theme';
import { healthHelpers } from '../../utils/healthHelpers';

interface HealthGaugeProps {
    value: number;
    maxValue: number;
    label: string;
    unit: string;
    type: 'hr' | 'spo2';
    size?: number;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
    value,
    maxValue,
    label,
    unit,
    type,
    size = 120,
}) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min((value / maxValue) * 100, 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const color = type === 'hr'
        ? healthHelpers.getHeartRateColor(value)
        : healthHelpers.getSpO2Color(value);

    return (
        <View style={styles.container}>
            <View style={styles.gaugeContainer}>
                <Svg width={size} height={size}>
                    {/* Background circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={COLORS.light.border}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>
                <View style={styles.valueContainer}>
                    <Text style={styles.value}>{Math.round(value)}</Text>
                    <Text style={styles.unit}>{unit}</Text>
                </View>
            </View>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    gaugeContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    value: {
        ...TEXT_STYLES.h2,
        fontWeight: 'bold',
        color: COLORS.light.text,
    },
    unit: {
        ...TEXT_STYLES.bodySmall,
        color: COLORS.light.textSecondary,
    },
    label: {
        ...TEXT_STYLES.body,
        color: COLORS.light.text,
        marginTop: SPACING.sm,
        fontWeight: '600',
    },
});
