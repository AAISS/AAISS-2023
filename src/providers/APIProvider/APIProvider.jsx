import {createContext, useCallback, useContext, useState} from "react";
import axios from "axios";
import URL from './URL'

export function APIProvider({children}) {

    const service = axios

    const [registerData, setRegisterData] = useState()

    const getRegisterData = useCallback(() => {
        service.get(`${URL.baseURL}${URL.services["2021"]}${URL.endpoints.misc.register}`)
            .then(response => {
                setRegisterData(response.data)
            })
    }, [service,])

    const context = {
        registerData,
        getRegisterData,
    }

    return (
        <APIContext.Provider value={context}>
            {children}
        </APIContext.Provider>
    )
}

const APIContext = createContext({})
export const useAPI = () => useContext(APIContext)