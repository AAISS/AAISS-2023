import './App.css';
import './App-mobile.css';
import './css/Nav.css';
import './css/Theme.css';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainContent from './components/main-content/MainContent.jsx';
import { APIProvider } from './providers/APIProvider/APIProvider.jsx';
import { ConfigProvider } from './providers/config-provider/ConfigProvider.jsx';
import { DictionaryProvider } from './providers/dictionary-provider/DictionaryProvider.jsx';
import { ThemeProvider } from './providers/theme-provider/ThemeProvider.jsx';

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <APIProvider>
          <DictionaryProvider>
            <ThemeProvider>
              <MainContent />
            </ThemeProvider>
          </DictionaryProvider>
        </APIProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
