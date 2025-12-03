**UI Components**

This page documents the reusable UI components available in the project and provides simple examples of how to use them.

**WSButton**

A customizable button component that adheres to the project's design system.

Usage:
```typescript
import WSButton from '../components/WSButton';

// 1. Standard button
<WSButton 
  label="Save Changes" 
  onClick={() => console.log('clicked')} 
/>

// 2. Submit button with full width and icon
<WSButton 
  label="Login" 
  type="submit" 
  fullWidth={true}
  icon={<SomeIcon />} 
  size="large"
/>
```
Props

- label: string (The text displayed inside the button)

- onClick: function (Event handler)

- size: 'small' | 'normal' | 'large'

- fullWidth: boolean (If true, stretches button to container width)

- type: 'button' | 'submit' | 'reset'

- disabled: boolean

**InputField**

A custom input field that handles standard text inputs, textareas, and select dropdowns. It automatically includes the label and standard styling.

Usage:
```typescript
import InputField from '../components/InputField';

// 1. Standard Text/Email/Password
<InputField 
  label="Email Address" 
  type="email" 
  placeholder="Enter email..."
  value={email} 
  onChange={(e) => setEmail(e.target.value)} 
/>

// 2. Textarea
<InputField 
  label="Description" 
  type="textarea" 
  rows={5}
  value={description} 
  onChange={handleChange} 
/>

// 3. Select Dropdown
<InputField 
  label="Role" 
  type="select" 
  value={role} 
  onChange={handleChange}
  options={[
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' }
  ]}
/>
```
Props

- label: string (Required)

- type: 'text', 'password', 'email', 'textarea', 'select', etc. (Default: 'text')

- options: { value: string|number, label: string }[] (Only used when type is 'select')

- rows: number (Only used when type is 'textarea')

**LoginRegisterToggle**

A switch component used on the Login/Register screens to toggle between the "Login" and "Register" forms.

Usage:
```typescript
import LoginRegisterToggle from '../components/LoginRegisterToggle';
import { useState } from 'react';

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <LoginRegisterToggle 
      activeTab={activeTab} 
      onToggle={(tab) => setActiveTab(tab)} 
    />
  );
};
```
**Logo**

Displays the "LeerMatch" graduation cap logo.

Usage:

```typescript
import Logo from '../components/Logo';

<Logo />
```