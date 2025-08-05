/**
 * Utility functions for localStorage management
 */

/**
 * Clears all localStorage data
 * This function removes all items from localStorage to ensure a clean logout
 */
export const clearAllLocalStorage = (): void => {
  try {
    localStorage.clear();
    console.log('All localStorage data cleared successfully');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Clears specific localStorage keys
 * @param keys - Array of localStorage keys to remove
 */
export const clearSpecificLocalStorage = (keys: string[]): void => {
  try {
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('Specific localStorage keys cleared successfully');
  } catch (error) {
    console.error('Error clearing specific localStorage keys:', error);
  }
};

/**
 * Gets all localStorage keys
 * @returns Array of all localStorage keys
 */
export const getAllLocalStorageKeys = (): string[] => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};
