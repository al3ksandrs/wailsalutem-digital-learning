# Testing Guidelines

We separate our testing strategies into **Client (Frontend)** and **Server (Backend)** due to differences in frameworks and environments.
We should probably examine if we can use just one framework for both.

## General Principles

### The AAA Pattern
All tests should follow the **Arrange-Act-Assert** pattern to ensure readability and structure.

1.  **Arrange**: Set up the initial state, mocks, and inputs.
2.  **Act**: Execute the function, component render, or API call being tested.
3.  **Assert**: Verify the output, side effects, or DOM state matches expectations.

### Best Practices
* **Isolation**: Tests should not depend on each other. Use `beforeEach` to reset mocks and state.
* **Descriptive names**: Test names should describe *what* is being tested and *expected behavior* (e.g., `it('should return 400 if email is missing')`).
* **Mock external dependencies**: Never hit a real database or external API during unit tests.

## Client Testing (Frontend)

We use **Vitest** with **React Testing Library**. Reason for this is because Vitest is compatible with our Vite build system.

* **Framework**: Vitest
* **Environment**: JSDOM (simulates a browser)
* **Setup File**: `client/src/tests/setup.ts`
* **Location**: `client/src/tests/`

### Example: Component testing
When testing React components, focus on user interaction and accessibility rather than implementation details.

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import LoginButton from '../components/LoginButton';

describe('LoginButton Component', () => {
    test('renders correctly and handles click', () => {
        // ARRANGE
        const handleClick = vi.fn(); // Vitest mock function
        render(<LoginButton onClick={handleClick} />);

        // ACT
        const button = screen.getByRole('button', { name: /login/i });
        fireEvent.click(button);

        // ASSERT
        expect(button).toBeInTheDocument();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
```

