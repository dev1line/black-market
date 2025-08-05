# localStorage Utilities

This directory contains utility functions for managing localStorage data, particularly for handling logout functionality.

## Functions

### `clearAllLocalStorage()`

Clears all localStorage data. This function removes all items from localStorage to ensure a clean logout.

**Usage:**

```typescript
import { clearAllLocalStorage } from './utils/localStorage';

// Clear all localStorage data
clearAllLocalStorage();
```

### `clearSpecificLocalStorage(keys: string[])`

Clears specific localStorage keys by providing an array of key names.

**Usage:**

```typescript
import { clearSpecificLocalStorage } from './utils/localStorage';

// Clear specific localStorage keys
clearSpecificLocalStorage(['auth_token', 'user_preferences']);
```

### `getAllLocalStorageKeys()`

Returns an array of all localStorage keys.

**Usage:**

```typescript
import { getAllLocalStorageKeys } from './utils/localStorage';

// Get all localStorage keys
const keys = getAllLocalStorageKeys();
console.log('Current localStorage keys:', keys);
```

## Integration with Logout

The localStorage clearing functionality has been integrated into the logout process in the following components:

1. **Nav.tsx** - Both desktop dropdown menu and mobile menu logout buttons
2. **AuthLogout.tsx** - Shared logout component in the ui-shared library

### Logout Flow

When a user logs out, the following actions occur:

1. **Clear localStorage** - All localStorage data is cleared using `clearAllLocalStorage()`
2. **Disconnect wallet** - If connected, the wallet is disconnected
3. **Sign out** - The authentication session is terminated

### Example Logout Implementation

```typescript
import { clearAllLocalStorage } from '../utils/localStorage';

const handleLogout = () => {
  // Clear all localStorage data
  clearAllLocalStorage();

  // Disconnect wallet if connected
  if (isConnected) {
    disconnect();
  }

  // Sign out from authentication
  signOut({ flow: 'redirect' });
};
```

## Error Handling

All localStorage utility functions include error handling to prevent crashes:

- Functions are wrapped in try-catch blocks
- Errors are logged to the console for debugging
- Functions gracefully handle cases where localStorage is not available

## Testing

Tests are available in `localStorage.test.ts` to verify the functionality works correctly.

Run tests with:

```bash
npm test localStorage.test.ts
```

## Browser Compatibility

These utilities work in all modern browsers that support localStorage. The functions include checks for localStorage availability and handle cases where it might not be available (e.g., in private browsing mode).
