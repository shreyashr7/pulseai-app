import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, SPACING, TEXT_STYLES, BORDER_RADIUS } from '../../theme';
import { HistoricalDataPoint } from '../../types';
import { format, parseISO } from 'date-fns';

interface LineChartComponentProps {
    data: HistoricalDataPoint[];
    dataKey: 'heartRate' | 'spo2' | 'healthScore';
    title: string;
    yAxisSuffix?: string;
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
    data,
    dataKey,
    title,
    yAxisSuffix = '',
}) => {
    const screenWidth = Dimensions.get('window').width - SPACING.md * 2;

    // Prepare chart data
    const values = data.map(point => point[dataKey] || 0);
    const labels = data.map(point => {
        try {
            return format(parseISO(point.timestamp), 'HH:mm');
        } catch {
            return '';
        }
    });

    // Show only a subset of labels to avoid crowding
    const labelInterval = Math.max(1, Math.floor(labels.length / 6));
    const displayLabels = labels.map((label, index) =>
        index % labelInterval === 0 ? label : ''
    );

    const chartData = {
        labels: displayLabels,
        datasets: [
            {
                data: values,
                color: (opacity = 1) => COLORS.primary,
                strokeWidth: 2,
            },
        ],
    };

    if (data.length === 0) {
        return (
            <View style={[styles.container, styles.emptyContainer]}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.emptyText}>No data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <LineChart
                data={chartData}
                width={screenWidth}
                height={220}
                yAxisSuffix={yAxisSuffix}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    style: {
                        borderRadius: BORDER_RADIUS.lg,
                    },
                    propsForDots: {
                        r: '3',
                        strokeWidth: '2',
                        stroke: COLORS.primary,
                    },
                    // Prevent crash when all values are the same or 0
                    count: 1,
                }}
                fromZero={dataKey === 'healthScore'} // Only use fromZero for score, for vitals let it scale but handle flat lines via library update or data check
                segments={4}
                bezier
                style={styles.chart}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACING.md,
    },
    title: {
        ...TEXT_STYLES.h4,
        color: COLORS.light.text,
        marginBottom: SPACING.sm,
    },
    chart: {
        marginVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.lg,
    },
    emptyContainer: {
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.light.surface,
        borderRadius: BORDER_RADIUS.lg,
    },
    emptyText: {
        ...TEXT_STYLES.body,
        color: COLORS.light.textSecondary,
    },
});
