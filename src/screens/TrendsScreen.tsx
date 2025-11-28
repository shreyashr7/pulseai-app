import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchHistoricalData, setTimeRange } from '../store/slices/healthSlice';
import { TimeRangeSelector } from '../components/charts/TimeRangeSelector';
import { LineChartComponent } from '../components/charts/LineChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';
import { SPACING, TEXT_STYLES } from '../theme';
import { useTheme } from '../theme/useTheme';
import { TimeRange } from '../types';

export const TrendsScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { historicalData, selectedTimeRange, loading } = useAppSelector(
        (state) => state.health
    );

    const { colors } = useTheme();
    const styles = React.useMemo(() => getStyles(colors), [colors]);

    const [activeTab, setActiveTab] = useState<'vitals' | 'score'>('vitals');

    useEffect(() => {
        dispatch(fetchHistoricalData(selectedTimeRange));
    }, [selectedTimeRange]);

    const handleRangeChange = (range: TimeRange) => {
        dispatch(setTimeRange(range));
    };

    if (loading && historicalData.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.title}>Health Trends</Text>
                <Text style={styles.subtitle}>
                    View your historical health data and patterns
                </Text>

                <TimeRangeSelector
                    selectedRange={selectedTimeRange}
                    onRangeChange={handleRangeChange}
                />

                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabs}>
                        <View
                            style={[
                                styles.tab,
                                activeTab === 'vitals' && styles.activeTab,
                            ]}
                            onTouchEnd={() => setActiveTab('vitals')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'vitals' && styles.activeTabText,
                                ]}
                            >
                                Vital Signs
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.tab,
                                activeTab === 'score' && styles.activeTab,
                            ]}
                            onTouchEnd={() => setActiveTab('score')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'score' && styles.activeTabText,
                                ]}
                            >
                                Health Score
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Charts */}
                {activeTab === 'vitals' ? (
                    <View>
                        <LineChartComponent
                            data={historicalData}
                            dataKey="heartRate"
                            title="Heart Rate"
                            yAxisSuffix=" bpm"
                        />
                        <LineChartComponent
                            data={historicalData}
                            dataKey="spo2"
                            title="Blood Oxygen (SpO₂)"
                            yAxisSuffix="%"
                        />
                    </View>
                ) : (
                    <View>
                        <LineChartComponent
                            data={historicalData}
                            dataKey="healthScore"
                            title="Health Score"
                        />
                        <Card style={styles.insightCard}>
                            <Text style={styles.insightTitle}>💡 Insights</Text>
                            <Text style={styles.insightText}>
                                Your health score has been relatively stable over the selected
                                period. Continue maintaining healthy habits!
                            </Text>
                        </Card>
                    </View>
                )}
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
        marginBottom: SPACING.xs,
    },
    subtitle: {
        ...TEXT_STYLES.body,
        color: colors.textSecondary,
        marginBottom: SPACING.lg,
    },
    tabContainer: {
        marginBottom: SPACING.lg,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        ...TEXT_STYLES.body,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    insightCard: {
        marginTop: SPACING.lg,
        backgroundColor: colors.secondary,
    },
    insightTitle: {
        ...TEXT_STYLES.h4,
        color: '#FFFFFF',
        marginBottom: SPACING.sm,
    },
    insightText: {
        ...TEXT_STYLES.body,
        color: '#FFFFFF',
    },
});
