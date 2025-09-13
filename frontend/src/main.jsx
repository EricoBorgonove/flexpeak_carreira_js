import React from 'react';
import  ReactDOM  from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from "./theme.js"
import App from './App.jsx'
import "./assets/css/global.css"

ReactDOM(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <BrowserRouter>
        <App />
    </BrowserRouter>
   </ThemeProvider>
);
