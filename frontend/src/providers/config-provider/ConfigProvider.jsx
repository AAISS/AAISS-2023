import {createContext, useContext, useEffect, useState} from "react";
import CONFIG from "./CONFIG.js";
import ROUTES from "./ROUTES.jsx";

export function ConfigProvider({children}) {
    const [lang, setLang] = useState(CONFIG.defaultLanguage)
    const [currentRoute, setCurrentRoute] = useState(ROUTES.home)
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()

    useEffect(() => {
        const currentURL = window.location.href
        const [temp0, temp2, temp3, ...path] = currentURL.split("/")
        const currentlySelectedRoute = ROUTES[Object.keys(ROUTES).find(name => {
            return ROUTES[name].path === '/' + path.join("/")
        })]
        setCurrentRoute(currentlySelectedRoute ?? ROUTES.home)

        const tokens = JSON.parse(localStorage["user"] ?? "{}")
        if (tokens.access != null) {
            setAccessToken(tokens.access)
            setRefreshToken(tokens.refresh)
        }
    }, [])

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
