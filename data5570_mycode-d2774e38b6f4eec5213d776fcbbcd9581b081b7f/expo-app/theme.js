import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const baseLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1a237e',
    secondary: '#f5f5f5',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    card: '#ffffff',
    border: '#e0e0e0',
    placeholder: '#666666',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    shadow: '#000000',
    surfaceVariant: '#e0e0e0',
    onSurface: '#000000',
    onBackground: '#000000',
  },
};

const baseDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#7986cb',
    secondary: '#2a2a2a',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    error: '#ef5350',
    success: '#66bb6a',
    warning: '#ffca28',
    info: '#42a5f5',
    card: '#2a2a2a',
    border: '#404040',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0, 0, 0, 0.7)',
    shadow: '#000000',
    surfaceVariant: '#2a2a2a',
    onSurface: '#ffffff',
    onBackground: '#ffffff',
  },
};

export const lightTheme = baseLightTheme;
export const darkTheme = baseDarkTheme; 