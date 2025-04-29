import React from 'react';
import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from 'react-redux';
import { store } from '../state/store';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Stack />
      </PaperProvider>
    </Provider>
  );
};

export default RootLayout;