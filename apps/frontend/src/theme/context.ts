import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const STORAGE_KEY = 'art-explorer:theme';

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);
