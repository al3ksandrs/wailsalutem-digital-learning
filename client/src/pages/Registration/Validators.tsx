// Defines the shape of the validation result.
export type ValidationResult = {
  isValid: boolean;
  errorMessage: string;
};

// Defines parameters for email validation.
type ValidateEmailParams = {
  email: string;
};

// Validates that the email follows standard format (user@domain.com).
export const validateEmail = (params: ValidateEmailParams): ValidationResult => {
  // Standard regex for basic email validation.
  //Checks for characters before '@', characters after '@', a dot, and characters after the dot.
  const { email } = params;
  const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,63}$/;

  if (!email) {
    return { isValid: false, errorMessage: 'Email address is required.' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address.' };
  }

  return { isValid: true, errorMessage: '' };
};

// Defines parameters for password validation.
type ValidatePasswordParams = {
  password: string;
};

// Validates the password against security standards (8 chars, Upper, Lower, Number).
export const validatePassword = (params: ValidatePasswordParams): ValidationResult => {
  const { password } = params;

  if (!password) {
    return { isValid: false, errorMessage: 'Password is required.' };
  }

  if (password.length < 8) {
    return { isValid: false, errorMessage: 'Password must be at least 8 characters long.' };
  }

  // Checks for at least one uppercase letter.
  const hasUpperCase = /[A-Z]/.test(password);
  // Checks for at least one lowercase letter.
  const hasLowerCase = /[a-z]/.test(password);
  // Checks for at least one numeric digit.
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      isValid: false,
      errorMessage: 'Password must contain an uppercase letter, a lowercase letter, and a number.',
    };
  }

  return { isValid: true, errorMessage: '' };
};