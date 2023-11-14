import "./App.css";
import './App-mobile.css'
import "./css/Nav.css";
import './css/Theme.css'

import MainContent from "./pages/MainContent.jsx";
import {ConfigProvider} from "./providers/config-provider/ConfigProvider.jsx";
import {ThemeProvider} from "./providers/theme-provider/ThemeProvider.jsx";
import {DictionaryProvider} from "./providers/dictionary-provider/DictionaryProvider.jsx";
import {APIProvider} from "./providers/APIProvider/APIProvider.jsx";
import {BrowserRouter} from "react-router-dom";
import React from "react";

function App() {

    return (
        <BrowserRouter>
            <ConfigProvider>
                <APIProvider>
                    <DictionaryProvider>
                        <ThemeProvider>
                            <MainContent/>
                        </ThemeProvider>
                    </DictionaryProvider>
                </APIProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
}

export default App;
