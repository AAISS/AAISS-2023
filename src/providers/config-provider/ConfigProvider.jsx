import {createContext, useContext, useState} from "react";
import CONFIG from "./CONFIG.js";
import ROUTES from "./ROUTES.js";

export function ConfigProvider({children}) {
    const [lang, setLang] = useState(CONFIG.defaultLanguage)
    const [currentRoute, setCurrentRoute] = useState(ROUTES.home)

    const context = {
        lang,
        setLang,
        currentRoute,
        setCurrentRoute,
        CONFIG,
        ROUTES,
    }
    return (
        <ConfigContext.Provider value={context}>
            {children}
        </ConfigContext.Provider>
    )
}

const ConfigContext = createContext({})
export const useConfig = () => useContext(ConfigContext)
