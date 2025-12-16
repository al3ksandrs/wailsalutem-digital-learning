# Coding guidelines for React and TypeScript

Interesting articles to read:

[Best practices for using TypeScript with React](https://medium.com/@mkare/best-practices-for-using-typescript-with-react-bad13d851143)

### Files
Files should follow these naming rules:

- File name matches the declaration name
- Use `.ts` extension for all TypeScript files
- Use `.tsx` extension for all React files
- Use appropriate casing:
  - PascalCase for:
    - Types representing objects
    - Classes
    - Namespaces
    - Enums
  - camelCase for:
    - Function types
    - Variable declarations
    - Function declarations

### Exports

**Named exports**

Prefer named exports over default exports. This ensures that import names are consistent across the codebase, making refactoring, searching, and auto-importing reliable.

```typescript
// DON'T use default exports
const UserCard = () => { ... };
export default UserCard;

// This allows inconsistent naming in imports:
// import Card from './UserCard';
// import User from './UserCard';

// DO use named exports
export const UserCard = () => { ... };

// This enforces consistent naming:
// import { UserCard } from './UserCard';
```

### Types

**Type Declarations**

Prefer type aliases instead of interfaces for better consistency and flexibility. Type aliases provide all the capabilities of interfaces while being more flexible and having clearer syntax for complex types.

```typescript
// DON'T use interfaces
interface User {
  id: number;
  name: string;
}

// DO use type aliases
type User = {
  id: number;
  name: string;
};
```

### React Components

**Defining Components**

Use explicit types for Props and prefer destructuring them immediately in the function signature. This makes it clear what data the component uses.

```typescript
// DON'T use 'any' or inline types that are hard to read
const UserCard = (props: any) => {
  return <div>{props.name}</div>;
};

// DO define specific types and destructure
type UserCardProps = {
  name: string;
  role: string;
  isActive?: boolean;
};

export const UserCard = ({ name, role, isActive = false }: UserCardProps) => {
  return (
    <div className={isActive ? "active" : ""}>
      {name} ({role})
    </div>
  );
};
```

**Boolean props**

Prefix boolean props with `is`, `has`, or `should` to clearly indicate they represent a state or a flag.

```typescript
// DON'T use ambiguous names
type Props = {
  disable: boolean; // sounds like a function
  open: boolean;    // could be a function or state
};

// DO use state-describing prefixes
type Props = {
  isDisabled: boolean;
  isOpen: boolean;
  hasError: boolean;
};
```

**Event handling**

Do not use `any` for event handlers. Use React's built-in types.

```typescript
// DON'T use any
const handleChange = (e: any) => { ... };

// DO use strict React types
import { ChangeEvent, MouseEvent } from 'react';

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};
```

### Variables

**Single Variable Per Decleration**

Always declare each variable separately:

```typescript
// DON'T declare multiple variables in one statement
let a, b;
let x = 1,
  y = 2;

// DO declare each variable separately
let a: number;
let b: string;

let x = 1;
let y = 2;
```

### Functions

**Function Parameters**

Prefer functions with a single parameter. When multiple parameters are needed, pass them as a single object with a type alias following the naming convention: `functionName` => `type functionNameParams`. Exceptions can be smaller functions.

```typescript
// DON'T use multiple parameters
function validateUser(
  email: string,
  age: number,
  preferences: UserPreferences
): ValidationResult {
  // Implementation
}

// DO use a single object parameter with a clear type alias
type ValidateUserParams = {
  email: string;
  age: number;
  preferences: UserPreferences;
};

function validateUser(params: ValidateUserParams): ValidationResult {
  const { email, age, preferences } = params;
  // Implementation
}
```

**Avoid Nested Functions**

Keep functions at the top level:

```typescript
// DON'T nest named functions
function processUserData(data: User): void {
  function validateEmail(): boolean {
    return data.email.includes("@");
  }

  function formatName(): string {
    return data.name.toUpperCase();
  }

  if (validateEmail()) {
    console.log(formatName());
  }
}

// DO keep functions at the top level
function validateEmail(email: string): boolean {
  return email.includes("@");
}

function formatName(name: string): string {
  return name.toUpperCase();
}

function processUserData(data: User): void {
  if (validateEmail(data.email)) {
    console.log(formatName(data.name));
  }
}
```

Exceptions are possible for:

1. Arrow functions in callbacks
2. Array method callbacks
3. React component methods

### Error handling

Make sure to have a `catch` for a `try`. Include meaningful error messages and consider logging or rethrowing as appropriate.

```typescript
// DON'T ignore errors
try {
  const user = fetchUserData();
} catch {
  // nothing here
}

// DO handle errors explicitly
try {
  const user = fetchUserData();
  console.log(user.name);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Failed to fetch user data:", error.message);
  } else {
    console.error("An unknown error occurred");
  }
}
```

For asynchronous code:

```typescript
// DON'T leave unhandled promises
async function getUserData() {
  return fetch("/api/user");
}
getUserData(); // no error handling

// DO handle promise rejections
async function getUserData() {
  try {
    const response = await fetch("/api/user");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch user data:", error instanceof Error ? error.message : error);
    throw error; // optional: rethrow if caller should handle
  }
}
```

### Documentation

For code that isn't easily understood when looking over it, include comments to explain functionality.

For such comments we use Consistent Comments.

- Write all comments in third person singular form of the present tense.

- Start each comment with a capital letter.

- End each comment with a period.

- Focus on explaining intent and non-obvious behavior, not repeating code.

```typescript
// DON'T leave unclear code uncommented
const result = calculate(data); // what does this actually do?

// DO explain intent and complex logic
// Calculates the total price including discounts and taxes.
const result = calculate(data);
```

```typescript
// DON'T use inconsistent or incomplete comments
// calculates total
const total = calculate(data);

// DO write consistent, grammatically correct comments
// Calculates total including discounts and taxes.
const total = calculate(data);

// DON'T use first person or commands
// I fix the user data here
function fixUserData(user: User) { ... }

// DO maintain third person present tense
// Fixes the user data to match API requirements.
function fixUserData(user: User) { ... }
```
