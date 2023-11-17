import './App.css';
import './App-mobile.css';
import './css/Nav.css';
import './css/Theme.css';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import MainContent from './components/main-content/MainContent.jsx';
import { APIProvider } from './providers/APIProvider/APIProvider.jsx';
import { ConfigProvider } from './providers/config-provider/ConfigProvider.jsx';
import { DictionaryProvider } from './providers/dictionary-provider/DictionaryProvider.jsx';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <BrowserRouter>
      <ConfigProvider>
        <APIProvider>
          <DictionaryProvider>
            <ThemeProvider theme={darkTheme}>
              <MainContent />
            </ThemeProvider>
          </DictionaryProvider>
        </APIProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
