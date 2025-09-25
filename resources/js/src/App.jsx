import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import { Button } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
} from "react-router-dom";
import router from './router';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
)