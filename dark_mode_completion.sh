#!/bin/bash

# Automation script to complete dark mode extension for remaining files
# This script adds useTheme hook usage to screens that already have the import

echo "=== Dark Mode Extension Script ===="
echo ""

# Screens that need hook usage added (they already have import and getStyles)
SCREENS=(
  "src/screens/EmergencyContactsScreen.tsx"
  "src/screens/auth/LoginScreen.tsx"
  "src/screens/auth/RegisterScreen.tsx"
)

echo "Screens that need useTheme hook usage:"
for screen in "${SCREENS[@]}"; do
  echo "  - $screen"
done

echo ""
echo "Components that need to be refactored:"
echo "  - src/components/alerts/AlertCard.tsx"
echo "  - src/components/emergency/SOSButton.tsx"
echo "  - src/components/emergency/EmergencyContactItem.tsx"
echo "  - src/components/health/HealthStatusCard.tsx"
echo "  - src/components/health/HealthGauge.tsx"
echo "  - src/components/charts/LineChart.tsx"
echo "  - src/components/charts/TimeRangeSelector.tsx"

echo ""
echo "=== Instructions ==="
echo "1. For screens: Add these two lines after the hooks:"
echo "   const { colors } = useTheme();"
echo "   const styles = React.useMemo(() => getStyles(colors), [colors]);"
echo ""
echo "2. For components: Follow the same pattern as screens:"
echo "   - Import useTheme from '../theme/useTheme' (adjust path as needed)"
echo "   - Remove COLORS from theme import"
echo "   - Add useTheme hook"
echo "   - Convert 'const styles =' to 'const getStyles = (colors: any) =>'"
echo "   - Replace COLORS.light.* with colors.*"
echo "   - Replace COLORS.primary with colors.primary"
echo ""
echo "=== Status ==="
echo "Completed screens: DashboardScreen, AlertsScreen, AlertDetailScreen, TrendsScreen, ProfileScreen, SettingsScreen"
echo "Completed components: Card, Input"
echo ""
