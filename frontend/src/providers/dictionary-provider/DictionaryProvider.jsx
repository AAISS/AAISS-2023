import {useConfig} from "../config-provider/ConfigProvider.jsx";
import {createContext, useCallback, useContext, useState} from "react";
import EN_DICT from "./EN_DICT.js";

export function DictionaryProvider({children}) {
    const {
        lang,
        CONFIG,
    } = useConfig()

    const getCurrentDict = useCallback(() => {
        switch (lang) {
            case CONFIG.languages.en:
                import("./EN_DICT.js")
                    .then(config => {
                        setDict(config.default)
                    });
                break;

            case CONFIG.languages.fa:
                import("./FA_DICT.js")
                    .then(config => {
                        setDict(config.default)
                    });
                break;

            default:
                import("./EN_DICT.js")
                    .then(config => {
                        return config.default
                    });
                break;
        }
    }, [lang,])

    const [dict, setDict] = useState(EN_DICT)
    getCurrentDict()

    const context = {
        dict
    }

    return (
        <DictionaryContext.Provider value={context}>
            {children}
        </DictionaryContext.Provider>
    )
}

const DictionaryContext = createContext({})
export const useDictionary = () => useContext(DictionaryContext)
