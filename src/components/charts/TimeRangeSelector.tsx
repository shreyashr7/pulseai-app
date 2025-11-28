import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TEXT_STYLES } from '../../theme';
import { TimeRange, TimeRangeOption } from '../../types';

const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
    { value: '24h', label: '24h', hours: 24 },
    { value: '7d', label: '7d', hours: 168 },
    { value: '30d', label: '30d', hours: 720 },
];

interface TimeRangeSelectorProps {
    selectedRange: TimeRange;
    onRangeChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
    selectedRange,
    onRangeChange,
}) => {
    return (
        <View style={styles.container}>
            {TIME_RANGE_OPTIONS.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.option,
                        selectedRange === option.value && styles.optionSelected,
                    ]}
                    onPress={() => onRangeChange(option.value)}
                >
                    <Text
                        style={[
                            styles.optionText,
                            selectedRange === option.value && styles.optionTextSelected,
                        ]}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: SPACING.md,
    },
    option: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        marginHorizontal: SPACING.xs,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.light.surface,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    optionSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    optionText: {
        ...TEXT_STYLES.body,
        color: COLORS.light.text,
        fontWeight: '500',
    },
    optionTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
