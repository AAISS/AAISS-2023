import {createContext, useCallback, useContext, useState} from "react";
import axios from "axios";
import URL from './URL'

export function APIProvider({children}) {

    const service = axios
    const currentYear = new Date().getFullYear()

    const [workshopsData, setWorkshopsData] = useState()
    const [presentationsData, setPresentationsData] = useState()
    const [teachersData, setTeachersData] = useState()
    const [staffData, setStaffData] = useState()
    const [miscData, setMiscData] = useState()
    const [userData, setUserData] = useState()
    const [createUserData, setCreateUserData] = useState()
    const [updateUserData, setUpdateUserData] = useState()
    const [partiallyUpdateUserData, setPartiallyUpdateUserData] = useState()
    const [deleteUserData, setDeleteUserData] = useState()
    const [activateUserData, setActivateUserData] = useState()
    const [paymentData, setPaymentData] = useState()
    const [verifyPaymentData, setVerifyPaymentData] = useState()
    const [committeeData, setCommitteeData] = useState()
    const [presenterData, setPresenterData] = useState()
    const [addToCartResponse, setAddToCartResponse] = useState()

    const addItemToCart = useCallback(async ({
                                                 type,
                                                 id,
                                             }) => {
        const body = {}
        let endpoint = ""
        switch (type) {
            case "presentation":
                body.presentation = id + ""
                endpoint = URL.endpoints.user.presentation
                break;
            case "workshop":
                body.talk = id + ""
                endpoint = URL.endpoints.user.workshop
                break;
            default:
                break;
        }

        await service.post(`${URL.baseURL}${URL.services.default}${endpoint}`, {
            data: body
        })
            .then(response => {
                setAddToCartResponse(response)
            })
            .catch(response => {
                setAddToCartResponse(response)
            })
    }, [service])

    const getPresenterData = useCallback(async (id) => {
        if (id != null) id = id + "/"
        await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.presenter}${id ?? ""}`)
            .then(response => {
                setPresenterData(response.data)
            })
    }, [service])

    const getCommitteeData = useCallback(async () => {
        await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.committee}`)
            .then(response => {
                setCommitteeData(response.data)
            })
    }, [service])

    const postVerifyPayment = useCallback(async (data) => {
        await service.post(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.payment.verify}`,
            data)
            .then(response => {
                setVerifyPaymentData(response.data)
            })
    }, [service])

    const postPaymentData = useCallback(async (data) => {
        await service.post(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.payment.default}`,
            data)
            .then(response => {
                setPaymentData(response.data)
            })
    }, [service])

    const activateUser = useCallback(async () => {
        await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.activate}`)
            .then(response => {
                setActivateUserData(response.data)
            })
    }, [service])

    const deleteUser = useCallback(async (data) => {
        await service.delete(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.default}`,
            data)
            .then(response => {
                setDeleteUserData(response.data)
            })
    }, [service])

    const partiallyUpdateUser = useCallback(async (data) => {
        await service.patch(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.default}`,
            data)
            .then(response => {
                setPartiallyUpdateUserData(response.data)
            })
    }, [service])

    const updateUser = useCallback(async (data) => {
        await service.put(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.default}`,
            data)
            .then(response => {
                setUpdateUserData(response.data)
            })
    }, [service])

    const createUser = useCallback(async (data) => {
        await service.post(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.default}`,
            data)
            .then(response => {
                setCreateUserData(response.data)
            })
    }, [service])

    const getUserData = useCallback(async (id) => {
        if (id != null) id = id + "/"
        await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.default}${id ?? ""}`)
            .then(response => {
                setUserData(response.data)
            })
    }, [service])

    const getMiscData = useCallback(async (id) => {
        if (id != null) id = id + "/"
        await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.misc}${id ?? ""}`)
            .then(response => {
                setMiscData(response.data)
            })
    }, [service])

    const getStaffData = useCallback(async () => {
        await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.staff}`)
            .then(response => {
                setStaffData(response.data)
            })
    }, [service])

    const getWorkshopsData = useCallback(async (id) => {
        if (id != null) id = id + "/"
        await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.workshop}${id ?? ""}`)
            .then(response => {
                setWorkshopsData(response.data)
            })
    }, [service])

    const getPresentationsData = useCallback(async () => {
        await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.presentation}`)
            .then(response => {
                setPresentationsData(response.data)
            })
    }, [service])

    const getTeachersData = useCallback(async () => {
        await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.presenter}`)
            .then(response => setTeachersData(response.data))
    }, [service,])


    const context = {
        workshopsData,
        getWorkshopsData,
        presentationsData,
        getPresentationsData,
        teachersData,
        getTeachersData,
        staffData,
        miscData,
        userData,
        createUserData,
        updateUserData,
        partiallyUpdateUserData,
        deleteUserData,
        activateUserData,
        paymentData,
        verifyPaymentData,
        committeeData,
        presenterData,
        getPresenterData,
        getCommitteeData,
        postVerifyPayment,
        postPaymentData,
        activateUser,
        deleteUser,
        partiallyUpdateUser,
        updateUser,
        createUser,
        getUserData,
        getMiscData,
        getStaffData,
        addItemToCart,
        addToCartResponse,
    }

    return (
        <APIContext.Provider value={context}>
            {children}
        </APIContext.Provider>
    )
}

const APIContext = createContext({})
export const useAPI = () => useContext(APIContext)