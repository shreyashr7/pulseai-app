import React, { useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { SPACING, BORDER_RADIUS, TEXT_STYLES } from '../../theme';
import { useTheme } from '../../theme/useTheme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const { colors } = useTheme();
    const styles = React.useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
                placeholderTextColor={colors.placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...textInputProps}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        ...TEXT_STYLES.bodySmall,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.xs,
    },
    input: {
        ...TEXT_STYLES.body,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        color: colors.text,
    },
    inputFocused: {
        borderColor: colors.primary, // Assuming primary is available in colors
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        ...TEXT_STYLES.caption,
        color: colors.error,
        marginTop: SPACING.xs,
    },
});
