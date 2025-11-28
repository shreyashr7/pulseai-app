import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleDarkMode, setDarkMode } from '../store/slices/settingsSlice';
import { COLORS } from './colors';

export const useTheme = () => {
    const dispatch = useAppDispatch();
    const isDark = useAppSelector((state) => state.settings.darkMode);

    const colors = {
        ...COLORS,
        ...((isDark ? COLORS.dark : COLORS.light)),
        // Ensure we have access to the raw light/dark objects if needed, 
        // but primarily we want the spread values to override base keys if they existed (they don't in this structure, but it's good practice)
        // In this specific COLORS structure, 'light' and 'dark' are nested objects, so we are flattening the active one.
        // We also keep the shared colors (primary, secondary, etc.) available.
    };

    const handleToggleTheme = () => {
        dispatch(toggleDarkMode());
    };

    const handleSetTheme = (isDark: boolean) => {
        dispatch(setDarkMode(isDark));
    };

    return {
        colors,
        isDark,
        toggleTheme: handleToggleTheme,
        setTheme: handleSetTheme,
    };
};
