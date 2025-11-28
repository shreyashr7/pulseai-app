export const validators = {
    // Email validation
    email: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Password validation
    password: (password: string): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    },

    // Phone number validation (simple)
    phone: (phone: string): boolean => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
    },

    // Required field validation
    required: (value: any): boolean => {
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }
        return value !== null && value !== undefined;
    },

    // Age validation
    age: (age: number): boolean => {
        return age >= 0 && age <= 150;
    },

    // Name validation
    name: (name: string): boolean => {
        return name.trim().length >= 2;
    },
};

export const validateLoginForm = (email: string, password: string): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!validators.required(email)) {
        errors.email = 'Email is required';
    } else if (!validators.email(email)) {
        errors.email = 'Invalid email format';
    }

    if (!validators.required(password)) {
        errors.password = 'Password is required';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateRegisterForm = (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    age?: number;
}): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!validators.required(data.name)) {
        errors.name = 'Name is required';
    } else if (!validators.name(data.name)) {
        errors.name = 'Name must be at least 2 characters';
    }

    if (!validators.required(data.email)) {
        errors.email = 'Email is required';
    } else if (!validators.email(data.email)) {
        errors.email = 'Invalid email format';
    }

    if (!validators.required(data.password)) {
        errors.password = 'Password is required';
    } else {
        const passwordCheck = validators.password(data.password);
        if (!passwordCheck.valid) {
            errors.password = passwordCheck.errors[0];
        }
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    if (data.age !== undefined && !validators.age(data.age)) {
        errors.age = 'Invalid age';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
