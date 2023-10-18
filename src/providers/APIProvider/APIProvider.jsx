import {createContext, useCallback, useContext, useState} from "react";
import axios from "axios";
import URL from './URL'

export function APIProvider({children}) {

    const service = axios

    const [registerData, setRegisterData] = useState()
    const [workshopsData, setWorkshopsData] = useState()
    const [presentationsData, setPresentationsData] = useState()

    const getRegisterData = useCallback(async () => {
        service.get(`${URL.baseURL}${URL.services["2021"]}${URL.endpoints.misc.register}`)
            .then(response => {
                setRegisterData(response.data)
            })
    }, [service,])

    const getWorkshopsData = useCallback(async () => {
        service.get(`${URL.baseURL}${URL.services["2021"]}${URL.endpoints.workshop}`)
            .then(response => {
                setWorkshopsData(response.data)
            })
    }, [service])

    const getPresentationsData = useCallback(async () => {
        service.get(`${URL.baseURL}${URL.services["2021"]}${URL.endpoints.presentation}`)
            .then(response => {
                setPresentationsData(response.data)
            })
    }, [service])

    const context = {
        registerData,
        getRegisterData,
        workshopsData,
        getWorkshopsData,
        presentationsData,
        getPresentationsData,
    }

    return (
        <APIContext.Provider value={context}>
            {children}
        </APIContext.Provider>
    )
}

const APIContext = createContext({})
export const useAPI = () => useContext(APIContext)