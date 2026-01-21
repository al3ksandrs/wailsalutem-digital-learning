import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from 'client/src/pages/Registration/Validators.tsx';

describe('AuthValidators', () => {

    // =========================================================================
    // validateEmail
    // Tests coverage for: Right (Happy path), Error (Empty/Invalid format)
    // =========================================================================
    describe('validateEmail', () => {
        
        it('should return error when email is empty', () => {
            // Arrange
            const params = { email: '' };

            // Act
            const result = validateEmail(params);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Email address is required.');
        });

        it('should return error when email format is invalid (missing @)', () => {
            // Arrange
            const params = { email: 'invalid-email.com' };

            // Act
            const result = validateEmail(params);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Please enter a valid email address.');
        });

        it('should return error when email format is invalid (missing domain)', () => {
            // Arrange
            const params = { email: 'user@' };

            // Act
            const result = validateEmail(params);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Please enter a valid email address.');
        });

        it('should return valid result for a correct email format', () => {
            // Arrange
            const params = { email: 'student@example.com' };

            // Act
            const result = validateEmail(params);

            // Assert
            expect(result.isValid).toBe(true);
            expect(result.errorMessage).toBe('');
        });
    });

    // =========================================================================
    // validatePassword
    // Tests coverage for: Right (Happy path), Boundary (Length), Error (Complexity)
    // =========================================================================
    describe('validatePassword', () => {
        
        it('should return error when password is empty', () => {
            // Arrange
            const params = { password: '' };

            // Act
            const result = validatePassword(params);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Password is required.');
        });

        it('should return error when password is below minimum length (Boundary: 7 chars)', () => {
            // Arrange
            // Right BICEP: Boundary check (limit - 1)
            const params = { password: 'Short1A' }; // 7 chars

            // Act
            const result = validatePassword(params);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Password must be at least 8 characters long.');
        });

        it('should return error when password lacks an uppercase letter', () => {
            // Arrange
            const params = { password: 'lowercase123' };

            // Act
            const result = validatePassword(params);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Password must contain an uppercase letter, a lowercase letter, and a number.');
        });

        it('should return error when password lacks a lowercase letter', () => {
            // Arrange
            
            const params = { password: 'NoNumbersHere' };

            // Act
            const result = validatePassword(params);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Password must contain an uppercase letter, a lowercase letter, and a number.');
        });

        it('should return valid result when password meets exact length requirement (Boundary: 8 chars)', () => {
            // Arrange
            // Right BICEP: Boundary check (exact limit)
            const params = { password: 'Valid1Aa' }; // 8 chars

            // Act
            const result = validatePassword(params);

            // Assert
            expect(result.isValid).toBe(true);
            expect(result.errorMessage).toBe('');
        });

        it('should return valid result for a complex password', () => {
            // Arrange
            const params = { password: 'Correct-Battery-Staple-1' };

            // Act
            const result = validatePassword(params);

            // Assert
            expect(result.isValid).toBe(true);
            expect(result.errorMessage).toBe('');
        });
    });
});