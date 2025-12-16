**UI Components**

This page documents the reusable UI components available in the project and provides simple examples of how to use them.

#### WS Button

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

- icon: React.ReactNode (Optional icon to display before text)

- disabled: boolean

- className: string (Optional custom class)

#### Input Field

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

// 4. Checkbox
<InputField 
  label="I agree to terms" 
  type="checkbox" 
  checked={isAgreed} 
  onChange={(e) => setIsAgreed(e.target.checked)}
/>
```
Props

- label: string (Required)

- type: 'text', 'password', 'email', 'textarea', 'select', 'checkbox', etc. (Default: 'text')

- options: { value: string|number, label: string }[] (Only used when type is 'select')

- rows: number (Only used when type is 'textarea')

- checked: boolean (Used only when type is 'checkbox')

#### Login / Register Toggle

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

#### Availability Slider

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
```

#### Achievement

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

#### Header / top bar

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
```

#### Hamburger Menu

A mobile-friendly hamburger menu that provides navigation and account options. Supports opening and closing via button or overlay click.

---

Usage:
```typescript
import HamburgerMenu from '../components/HamburgerMenu';

const AppLayout = () => {
  return <HamburgerMenu />;
};

```

#### Main Info Panel

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

#### Modal

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

#### Logout Button

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

#### Expandable List

A generic list component that handles displaying items, adding new items, and removing existing items. Useful for dynamic forms like adding expertise or lists.

Usage:
```typescript
import ExpandableList from '../components/ExpandableList';

const MyList = () => {
  const [items, setItems] = useState([{ id: 1, value: 'HBO' }]);

  return (
    <ExpandableList
      items={items}
      getItemKey={(item) => item.id}
      renderItem={(item, index) => <span>{item.value}</span>}
      onAdd={() => handleAdd()}
      onRemove={(index) => handleRemove(index)}
      maxItems={5}
    />
  );
};
```

Props:

- items: T[] (Array of data objects)

- renderItem: (item: T, index: number) => ReactNode (Function to render specific item content)

- getItemKey: (item: T) => string | number (Function to get unique key)

- onAdd: () => void

- onRemove: (index: number) => void

- maxItems: number (Optional, defaults to 4)

#### Screen Layout

A layout component that enforces the standard application structure as based on the design we made.
Contains a left content screen, right content screen and a greeting for the user.

Usage:
```typescript
import ScreenLayout from '../components/ScreenLayout';

const StudentPage = () => {
  return (
    <ScreenLayout
      greeting="Hello, Hendrik"
      rightTitle="Suggested Matches"
      leftContent={<MainInfoPanel />}
      rightContent={<div>Main content here...</div>}
    />
  );
};
```

Props:

- greeting: string (Optional top header text)

- leftContent: ReactNode (Content for the sidebar)

- rightContent: ReactNode (Main content area)

- rightTitle: string (Optional title for the right section)

#### Subject Tags

Displays a list of tags (strings) as pills. Supports both horizontal and vertical layouts. If the number of tags exceeds maxItems, a dropdown expander arrow is shown.

Usage:
```typescript
import SubjectTags from '../components/SubjectTags';

const MyTags = () => {
  const subjects = ['Math', 'Science', 'History', 'Art'];
  
  return (
    <SubjectTags
      items={subjects}
      maxItems={3}
      direction="horizontal" // or 'vertical'
      showDropdown={true}
    />
  );
};
```

Props:

- items: string[] (List of tags)

- maxItems: number (Number of tags to show before collapsing)

- direction: 'horizontal' | 'vertical'

- showDropdown: boolean (Whether to enable the expand/collapse feature)