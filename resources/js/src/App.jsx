import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';

import theme from '../theme';
import router from './router';
import api from '../src/axios';
import { LanguageProvider } from './LanguageProvider';
import useOnlineSync from './hooks/useOnlineSync';
import 'virtual:pwa-register';


function App() {
  useOnlineSync();

  useEffect(() => {
    // Load favicon from localStorage (if logged in)
    const favicon = localStorage.getItem('favicon');
    const faviconTag = document.getElementById('app-favicon');

    if (favicon && faviconTag) {
      faviconTag.href = favicon;
    } else if (faviconTag) {
      faviconTag.href = '/default-favicon.png';
    }
  }, []);

  return (
    <LanguageProvider api={api}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <RouterProvider router={router} />
      </ChakraProvider>
    </LanguageProvider>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
