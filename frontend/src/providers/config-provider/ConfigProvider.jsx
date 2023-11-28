import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import CONFIG from './CONFIG.js';
import ROUTES from './ROUTES.jsx';

export function ConfigProvider({ children }) {
  const [lang, setLang] = useState(CONFIG.defaultLanguage);
  const [currentRoute, setCurrentRoute] = useState(ROUTES.home);
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [routeParams, setRouteParams] = useState({});
  const [currentPath, setCurrentPath] = useState();

  const setAccessTokenFromLocalStorage = useCallback(() => {
    const tokens = JSON.parse(localStorage['user'] ?? '{}');
    if (tokens.access != null) {
      setAccessToken(tokens.access);
      if (tokens.refresh) {
        setRefreshToken(tokens.refresh);
      } else {
        tokens.refresh = refreshToken;
        localStorage['user'] = JSON.stringify(tokens);
      }
    } else {
      setAccessToken(null);
      setRefreshToken(null);
    }
  }, [refreshToken]);

  useEffect(() => {
    if (!currentPath) return;
    switch ('/' + currentPath) {
      case ROUTES.myAccount.path:
        console.log('myacc');
        if (!accessToken) {
          window.location.replace(ROUTES.signup.path);
          // navigate(ROUTES.signup.path)
        }
        break;
      case ROUTES.signup.path:
        console.log('sign');
        if (accessToken) {
          window.location.replace(ROUTES.myAccount.path);
          // navigate(ROUTES.myAccount.path)
        }
        break;
      default:
        break;
    }
  }, [accessToken, currentPath]);

  const updateCurrentRoute = useCallback(() => {
    const currentURL = window.location.href;
    const [, , , ...path] = currentURL.split('/');
    const currentlySelectedRoute =
      ROUTES[
        Object.keys(ROUTES).find((name) => {
          return ROUTES[name].path === '/' + path.join('/');
        })
      ];
    setCurrentRoute(currentlySelectedRoute ?? ROUTES.home);
    updateRouteParams(path);
  }, [setCurrentRoute]);

  const updateRouteParams = useCallback((path) => {
    path = path[0];
    setCurrentPath(path.split('?')[0]);
    if (!path.includes('?')) return;

    setCurrentPath(path.split('?')[0]);
    path = path.split('?')[1];
    const params = {};
    path.split('&').forEach((param) => {
      const splitParam = param.split('=');
      params[splitParam[0]] = splitParam[1];
    });
    setRouteParams(params);
  }, []);

  useEffect(() => {
    updateCurrentRoute();
    setAccessTokenFromLocalStorage();
  }, [setAccessTokenFromLocalStorage, updateCurrentRoute]);

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
    routeParams,
  };
  return <ConfigContext.Provider value={context}>{children}</ConfigContext.Provider>;
}

const ConfigContext = createContext({});
export const useConfig = () => useContext(ConfigContext);
