import {useCallback, useEffect, useState} from "react";
import {useAPI} from "../../providers/APIProvider/APIProvider.jsx";
import {useConfig} from "../../providers/config-provider/ConfigProvider.jsx";
import { useNavigate } from 'react-router-dom';

export default function useMyAccount() {

    const {
        getUserWorkshops,
        getUserPresentations,
        userPresentationsData,
        userWorkshopsData,
        getWorkshopsData,
        getPresentationsData,
        workshopsData,
        presentationsData,
        removeFromUserCart,
        removeFromCartResponse,
        setRemoveFromCartResponse,
        setWorkshopsData,
        setPresentationsData,
        postPaymentData,
        paymentData,
    } = useAPI()

    const {
        accessToken
    } = useConfig()

    const navigate = useNavigate();

    const [talks, setTalks] = useState()
    const [workshops, setWorkshops] = useState()
    const [cart, setCart] = useState()
    const [openToast, setOpenToast] = useState()
    const [toastData, setToastData] = useState()

    const removeFromCartHandler = useCallback(({id, type}) => {
        removeFromUserCart({
            id: id,
            type: type,
        })
    }, [removeFromUserCart])

    const handleBuyCart = useCallback(() => {
        postPaymentData()
    }, [postPaymentData])

    useEffect(() => {
        if (paymentData == null)
            return

        if (paymentData.status !== 200 || paymentData.data.status !== 200) {
            const toastTemp = {}
            toastTemp.message = "Unknown Error! Please Try Again Later"
            toastTemp.alertType = "error"
            setOpenToast(true)
            setToastData(toastTemp)
            return
        }

        console.log(paymentData.data.message)
        navigate(paymentData.data.message)
    }, [paymentData])

    useEffect(() => {
        if (removeFromCartResponse == null)
            return

        const toastDataTemp = {}
        switch (removeFromCartResponse.status) {
            case 200:
                toastDataTemp.message = "Item Removed Successfully"
                toastDataTemp.alertType = "success"
                break;
            case 400:
                toastDataTemp.message = "Failed to Remove Item"
                toastDataTemp.alertType = "error"
                break;
            default:
                toastDataTemp.message = "Unknown Error. Please Try Again Later"
                toastDataTemp.alertType = "error"
                break;
        }

        setRemoveFromCartResponse(null)
        setToastData(toastDataTemp)
        setOpenToast(true)
        setWorkshopsData(null)
        setPresentationsData(null)
        getUserWorkshops()
        getUserPresentations()
    }, [removeFromCartResponse])

    useEffect(() => {
        if (!accessToken)
            return

        getWorkshopsData()
        getPresentationsData()
        getUserWorkshops()
        getUserPresentations()
    }, [accessToken, getUserPresentations, getUserWorkshops])

    useEffect(() => {
        if (!userPresentationsData
            || !userWorkshopsData
            || !workshopsData
            || !presentationsData)
            return


        const userTempPresentations = []
        const userTempWorkshops = []
        const userTempCart = []
        for (const presentation of presentationsData) {
            for (const userPresentation of userPresentationsData.data) {
                if (presentation.id === userPresentation.id) {
                    presentation.type = "presentation"
                    if (userPresentation.status !== "AWAITING_PAYMENT") {
                        userTempPresentations.push(presentation)
                    } else {
                        userTempCart.push(presentation)
                    }
                }
            }
        }
        for (const workshop of workshopsData) {
            for (const userWorkshop of userWorkshopsData.data) {
                if (workshop.id === userWorkshop.id) {
                    workshop.type = "workshop"
                    if (userWorkshop.status !== "AWAITING_PAYMENT") {
                        userTempWorkshops.push(workshop)
                    } else {
                        userTempCart.push(workshop)
                    }
                }
            }
        }

        setTalks(userTempPresentations)
        setWorkshops(userTempWorkshops)
        setCart(userTempCart)
    }, [userPresentationsData, workshopsData, presentationsData, userWorkshopsData])

    return {
        talks,
        workshops,
        removeFromCartHandler,
        cart,
        toastData,
        openToast,
        setOpenToast,
        handleBuyCart,
    };
}
