import {createContext, useCallback, useContext, useState} from "react";
import axios from "axios";
import URL from './URL'

export function APIProvider({children}) {

    const service = axios
    const currentYear = new Date().getFullYear()

    const [registerData, setRegisterData] = useState()
    const [workshopsData, setWorkshopsData] = useState()
    const [presentationsData, setPresentationsData] = useState()
    const [teachersData ,setTeachersData] = useState()
    const getRegisterData = useCallback(async () => {
        service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.misc.register}`)
            .then(response => {
                setRegisterData(response.data)
            })
    }, [service,])

    const getWorkshopsData = useCallback(async () => {
        service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.workshop}`)
            .then(response => {
                setWorkshopsData(response.data)
            })
    }, [service])

    const getPresentationsData = useCallback(async () => {
        service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.presentation}`)
            .then(response => {
                setPresentationsData(response.data)
            })
    }, [service])

    const getTeachersData = useCallback(async ()=> {
        service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.presenter}`)
            .then(response => setTeachersData(response.data))
    }, [service, ])


    const context = {
        registerData,
        getRegisterData,
        workshopsData,
        getWorkshopsData,
        presentationsData,
        getPresentationsData,
        teachersData,
        getTeachersData,
    }

    return (
        <APIContext.Provider value={context}>
            {children}
        </APIContext.Provider>
    )
}

const APIContext = createContext({})
export const useAPI = () => useContext(APIContext)