import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatters = {
    // Format date/time
    dateTime: (dateString: string, formatString: string = 'PPp'): string => {
        try {
            const date = parseISO(dateString);
            return format(date, formatString);
        } catch (error) {
            return dateString;
        }
    },

    // Format date only
    date: (dateString: string): string => {
        try {
            const date = parseISO(dateString);
            return format(date, 'PP');
        } catch (error) {
            return dateString;
        }
    },

    // Format time only
    time: (dateString: string): string => {
        try {
            const date = parseISO(dateString);
            return format(date, 'p');
        } catch (error) {
            return dateString;
        }
    },

    // Relative time (e.g., "2 hours ago")
    relativeTime: (dateString: string): string => {
        try {
            const date = parseISO(dateString);
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            return dateString;
        }
    },

    // Format heart rate
    heartRate: (hr: number): string => {
        return `${Math.round(hr)} bpm`;
    },

    // Format SpO2
    spo2: (spo2: number): string => {
        return `${Math.round(spo2)}%`;
    },

    // Format health score
    healthScore: (score: number): string => {
        return `${Math.round(score)}/100`;
    },

    // Format duration in minutes
    duration: (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    },

    // Format phone number
    phone: (phone: string): string => {
        // Simple formatting for display
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    },

    // Capitalize first letter
    capitalize: (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
};
