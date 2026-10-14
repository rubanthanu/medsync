/**
 * Password validation utilities for MedSync / MediSphere
 *
 * Rules:
 * - At least 8 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 number (0-9)
 * - At least 1 special character (@$!%*?&)
 */

export const PASSWORD_REQUIREMENTS = [
    { id: 'minLength', label: 'At least 8 characters' },
    { id: 'hasUpper', label: 'At least 1 uppercase letter (A-Z)' },
    { id: 'hasLower', label: 'At least 1 lowercase letter (a-z)' },
    { id: 'hasNumber', label: 'At least 1 number (0-9)' },
    { id: 'hasSpecial', label: 'At least 1 special character (@$!%*?&)' }
];

export const validatePassword = (password = '') => {
    const pwd = typeof password === 'string' ? password : '';
    return {
        minLength: pwd.length >= 8,
        hasUpper: /[A-Z]/.test(pwd),
        hasLower: /[a-z]/.test(pwd),
        hasNumber: /[0-9]/.test(pwd),
        hasSpecial: /[@$!%*?&]/.test(pwd)
    };
};

export const isPasswordValid = (password = '') => {
    const results = validatePassword(password);
    return Object.values(results).every(Boolean);
};

export const getPasswordScore = (password = '') => {
    if (!password) {
        return { score: 0, label: 'Empty', color: 'secondary', percent: 0 };
    }

    const checks = validatePassword(password);
    const passedCount = Object.values(checks).filter(Boolean).length;

    if (passedCount <= 2) {
        return { score: 1, label: 'Weak', color: 'danger', percent: 25 };
    } else if (passedCount <= 3) {
        return { score: 2, label: 'Fair', color: 'warning', percent: 50 };
    } else if (passedCount <= 4) {
        return { score: 3, label: 'Good', color: 'info', percent: 75 };
    } else {
        return { score: 4, label: 'Strong', color: 'success', percent: 100 };
    }
};
