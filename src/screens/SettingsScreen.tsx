import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Switch,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    updateThresholds,
    updateNotificationPreferences,
} from '../store/slices/settingsSlice';
import { useTheme } from '../theme/useTheme';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { SPACING, TEXT_STYLES } from '../theme';

export const SettingsScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const settings = useAppSelector((state) => state.settings);
    const { colors, toggleTheme } = useTheme();
    const styles = React.useMemo(() => getStyles(colors), [colors]);

    const handleThresholdChange = (key: string, value: string) => {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            dispatch(updateThresholds({ [key]: numValue }));
        }
    };

    const handleNotificationToggle = (key: string, value: boolean) => {
        dispatch(updateNotificationPreferences({ [key]: value }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.title}>Settings</Text>

                {/* Alert Thresholds */}
                <Text style={styles.sectionTitle}>Alert Thresholds</Text>
                <Card style={styles.card}>
                    <Input
                        label="Low SpO₂ Threshold (%)"
                        value={settings.thresholds.lowSpo2.toString()}
                        onChangeText={(text) => handleThresholdChange('lowSpo2', text)}
                        keyboardType="numeric"
                    />
                    <Input
                        label="High Heart Rate Threshold (bpm)"
                        value={settings.thresholds.highHeartRate.toString()}
                        onChangeText={(text) => handleThresholdChange('highHeartRate', text)}
                        keyboardType="numeric"
                    />
                    <Input
                        label="Low Heart Rate Threshold (bpm)"
                        value={settings.thresholds.lowHeartRate.toString()}
                        onChangeText={(text) => handleThresholdChange('lowHeartRate', text)}
                        keyboardType="numeric"
                    />
                </Card>

                {/* Notification Preferences */}
                <Text style={styles.sectionTitle}>Notification Preferences</Text>
                <Card style={styles.card}>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Predictive Alerts</Text>
                        <Switch
                            value={settings.notifications.predictiveAlerts}
                            onValueChange={(value) =>
                                handleNotificationToggle('predictiveAlerts', value)
                            }
                            trackColor={{ false: colors.disabled, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Anomaly Alerts</Text>
                        <Switch
                            value={settings.notifications.anomalyAlerts}
                            onValueChange={(value) =>
                                handleNotificationToggle('anomalyAlerts', value)
                            }
                            trackColor={{ false: colors.disabled, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Emergency Alerts</Text>
                        <Switch
                            value={settings.notifications.emergencyAlerts}
                            onValueChange={(value) =>
                                handleNotificationToggle('emergencyAlerts', value)
                            }
                            trackColor={{ false: colors.disabled, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Sound</Text>
                        <Switch
                            value={settings.notifications.soundEnabled}
                            onValueChange={(value) =>
                                handleNotificationToggle('soundEnabled', value)
                            }
                            trackColor={{ false: colors.disabled, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Vibration</Text>
                        <Switch
                            value={settings.notifications.vibrationEnabled}
                            onValueChange={(value) =>
                                handleNotificationToggle('vibrationEnabled', value)
                            }
                            trackColor={{ false: colors.disabled, true: colors.primary }}
                        />
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    title: {
        ...TEXT_STYLES.h2,
        color: colors.text,
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        ...TEXT_STYLES.h4,
        color: colors.text,
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    card: {
        marginBottom: SPACING.md,
        backgroundColor: colors.card,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    settingLabel: {
        ...TEXT_STYLES.body,
        color: colors.text,
    },
});
