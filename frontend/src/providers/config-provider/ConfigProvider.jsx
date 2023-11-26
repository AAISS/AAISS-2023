import {createContext, useCallback, useContext, useEffect, useState} from "react";
import CONFIG from "./CONFIG.js";
import ROUTES from "./ROUTES.jsx";

export function ConfigProvider({children}) {
    const [lang, setLang] = useState(CONFIG.defaultLanguage)
    const [currentRoute, setCurrentRoute] = useState(ROUTES.home)
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()

    const setAccessTokenFromLocalStorage = useCallback(() => {
        const lsItem = localStorage["user"]
        const tokens = JSON.parse(lsItem !== 'null' ? lsItem : "{}")
        if (tokens.access != null) {
            setAccessToken(tokens.access)
            if (tokens.refresh) {
                setRefreshToken(tokens.refresh)
            } else {
                tokens.refresh = refreshToken
                localStorage["user"] = JSON.stringify(tokens)
            }
        } else {
            setAccessToken(null)
            setRefreshToken(null)
        }
    }, [refreshToken])

    const updateCurrentRoute = useCallback(() => {
        const currentURL = window.location.href
        const [, , , ...path] = currentURL.split("/")
        const currentlySelectedRoute = ROUTES[Object.keys(ROUTES).find(name => {
            return ROUTES[name].path === '/' + path.join("/")
        })]
        setCurrentRoute(currentlySelectedRoute ?? ROUTES.home)
    }, [setCurrentRoute])


    useEffect(() => {
        updateCurrentRoute()
        setAccessTokenFromLocalStorage()
    }, [setAccessTokenFromLocalStorage, updateCurrentRoute])


    const context = {
        lang,
        setLang,
        currentRoute,
        setCurrentRoute,
        CONFIG,
        ROUTES,
        refreshToken,
        accessToken,
        setAccessTokenFromLocalStorage,
    }
    return (
        <ConfigContext.Provider value={context}>
            {children}
        </ConfigContext.Provider>
    )
}

const ConfigContext = createContext({})
export const useConfig = () => useContext(ConfigContext)
