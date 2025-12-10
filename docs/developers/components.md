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

**AvailabilitySlider**

A slider component to select an availability range (hours) for a given day. Displays both a Material UI range slider and the currently selected time range.

---

Usage:
```typescript
import AvailabilitySlider from '../components/AvailabilitySlider';
import { useState } from 'react';

const Schedule = () => {
  const [mondayHours, setMondayHours] = useState<number[]>([9, 17]);

  return (
    <AvailabilitySlider
      day="Monday"
      value={mondayHours}
      onChange={(newRange) => setMondayHours(newRange)}
    />
  );
};

**Achievement**

A component to display an achievement badge with title, description, and a progress bar showing completion percentage.

---

Usage:

```typescript
import Achievement from '../components/Achievement';
import BadgeImage from '../assets/badges/blue-check.png';

<Achievement
  title="Verified Teacher"
  description="Verified by a resume."
  badgeSrc={BadgeImage}
  progress={45}
/>
```

**Header**

The main header component for the application. Displays the logo, navigation tabs, notifications, and logout button. Supports both desktop and mobile layouts.

---

Usage:
```typescript
import Header from '../components/Header';

const AppLayout = () => {
  const handleLogout = () => {
    console.log('User logged out');
  };

  return <Header onLogout={handleLogout} />;
};



**HamburgerMenu**

A mobile-friendly hamburger menu that provides navigation and account options. Supports opening and closing via button or overlay click.

---

Usage:
```typescript
import HamburgerMenu from '../components/HamburgerMenu';

const AppLayout = () => {
  return <HamburgerMenu />;
};

```


**MainInfoPanel**

Displays summary information about the user's pending requests, matches, and connections. Designed as a dashboard info panel with icons and numeric values.

---

Usage:
```typescript
import MainInfoPanel from '../components/MainInfoPanel';

const Dashboard = () => {
  return (
    <MainInfoPanel 
      pending={3} 
      matches={5} 
      connections={12} 
    />
  );
};

```

**Modal**

A reusable modal dialog component. Displays content in a centered overlay with optional title and a close button. Clicking outside the modal or the close button will dismiss it.

---

Usage:
```typescript
import Modal from '../components/Modal';
import { useState } from 'react';

const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Example Modal"
      >
        <p>This is the modal content!</p>
      </Modal>
    </>
  );
};

```

**LogoutButton**

A simple button component for logging out of the application. Includes a sign-out icon and text.

---

Usage:
```typescript
import LogoutButton from '../components/LogoutButton';

const Example = () => {
  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <LogoutButton onClick={handleLogout} />
  );
};

```

