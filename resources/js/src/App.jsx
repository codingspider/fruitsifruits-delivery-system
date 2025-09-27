import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';

import theme from '../theme';
import router from './router';
import api from '../src/axios';
import { LanguageProvider } from './LanguageProvider';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <LanguageProvider api={api}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </LanguageProvider>
  </React.StrictMode>
);
