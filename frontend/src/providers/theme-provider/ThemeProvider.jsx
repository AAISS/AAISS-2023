import FONTS from "./FONTS.js";
import COLORS from "./COLORS.js";
import {createContext, useContext} from "react";

export function ThemeProvider({children}) {
    const context = {
        FONTS,
        COLORS,
    }

    return (
        <ThemeContext.Provider value={context}>
            {children}
        </ThemeContext.Provider>
    )
}

const ThemeContext = createContext({})
export const useTheme = () => useContext(ThemeContext)
