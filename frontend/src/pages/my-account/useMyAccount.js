import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAPI} from '../../providers/APIProvider/APIProvider.jsx';
import {useConfig} from '../../providers/config-provider/ConfigProvider.jsx';

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
        getTeachersData,
        teachersData,
        getPresenterData,
        presenterData,
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
    const [buyButtonLoading, setBuyButtonLoading] = useState(false)
    const [offCode, setOffCode] = useState("")

    const removeFromCartHandler = useCallback(({id, type}) => {
        removeFromUserCart({
            id: id,
            type: type,
        })
    }, [removeFromUserCart])

    const handleBuyCart = useCallback(() => {
        if (offCode === "") {
            postPaymentData({
                call_back: 'https://aaiss.ir/callback',
            });
        } else {
            postPaymentData({
                call_back: 'https://aaiss.ir/callback',
                discount_code: offCode
            });
        }
        setBuyButtonLoading(true)
    }, [offCode, postPaymentData]);

    const handleOffCodeInputHandler = useCallback(e => {
        setOffCode(e.target.value)
    }, [])

    useEffect(() => {
        if (!paymentData)
            return

        const responseData = paymentData.data.data; // Access the 'data' field inside the response body's 'data' field

        if (paymentData.status === 200 && responseData && responseData.is_free === true) {
            setOpenToast(true)
            setToastData({
                message: "Success! Your free items have been registered.",
                alertType: "success"
            })
            setBuyButtonLoading(false)

            getWorkshopsData()
            getPresentationsData()
            getUserWorkshops()
            getUserPresentations()
            getTeachersData()
            getPresenterData()
            return
        }

        if (paymentData.status !== 200 || paymentData.data.status !== 200) {
            setOpenToast(true)

            let message = "There was an Error Regarding Your Payment! Please Try Again Later";
            let alertType = "error";

            if (paymentData.status !== 200) {
                const messageDetail = paymentData.data?.message;
                if (messageDetail?.includes("Discount")) {
                    message = "Invalid Discount Code! Please check your code.";
                } else if (messageDetail?.includes("is full") || messageDetail?.includes("Registraition closed")) {
                    message = "Some items are full or registration is closed. Please remove them and try again.";
                }
            }
            else if (paymentData.status === 200 && paymentData.data.status === 202) {
                message = "Success! Don't forget to attend them ;)";
                alertType = "success";

                getWorkshopsData()
                getPresentationsData()
                getUserWorkshops()
                getUserPresentations()
                getTeachersData()
                getPresenterData()
            }

            setToastData({ message, alertType });
            setBuyButtonLoading(false);
            return
        }

        setOpenToast(true)
        setToastData({
            message: "Success! Redirecting to payment gateway...",
            alertType: "success"
        })

        const paymentUrl = responseData.payment_url;

        if (paymentUrl) {
            setTimeout(() => {
                window.location.href = paymentUrl
            }, 2000)
        } else {
             setToastData({
                message: "Payment created successfully, but no redirect URL found. Please check your registrations.",
                alertType: "warning"
            })
             setBuyButtonLoading(false)
        }

    }, [
        paymentData,
        getWorkshopsData,
        getPresentationsData,
        getUserWorkshops,
        getUserPresentations,
        getTeachersData,
        getPresenterData
    ]);

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

        setToastData(toastDataTemp)
        setOpenToast(true)
        getUserWorkshops()
        getUserPresentations()
    }, [removeFromCartResponse, getUserPresentations, getUserWorkshops, setOpenToast, setToastData])

    useEffect(() => {
        if (!accessToken)
            return

        getWorkshopsData()
        getPresentationsData()
        getUserWorkshops()
        getUserPresentations()
        getTeachersData()
        getPresenterData()
    }, [accessToken, getUserPresentations, getUserWorkshops])

    useEffect(() => {
        if (!userPresentationsData
            || !userWorkshopsData
            || !workshopsData
            || !presenterData
            || !teachersData
            || !presentationsData)
            return


        let userTempPresentations = []
        let userTempWorkshops = []
        let userTempCart = []
        for (const presentation of presentationsData) {
            for (const userPresentation of userPresentationsData.data) {
                if (presentation.id === userPresentation.id) {
                    presentation.type = "presentation"
                    if (userPresentation.status !== "AWAITING_PAYMENT") {
                        if (userPresentation.certificate) {
                            presentation.certificateLink = userPresentation.certificate
                        }
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
                        if (userWorkshop.certificate) {
                            workshop.certificateLink = userWorkshop.certificate
                        }
                        userTempWorkshops.push(workshop)
                    } else {
                        userTempCart.push(workshop)
                    }
                }
            }
        }

        for (const presenterOrTeacher of teachersData.concat(presenterData)) {
            userTempWorkshops = userTempWorkshops.map(workshop => {
                const newTeachers = []
                for (const id of workshop.teachers) {
                    if (id === presenterOrTeacher.id) {
                        newTeachers.push(presenterOrTeacher.name)
                    } else {
                        newTeachers.push(id)
                    }
                }
                workshop.teachers = newTeachers
                return workshop
            })
            userTempPresentations = userTempPresentations.map(presentation => {
                const newPresenters = []
                for (const id of presentation.presenters) {
                    if (id === presenterOrTeacher.id) {
                        newPresenters.push(presenterOrTeacher.name)
                    } else {
                        newPresenters.push(id)
                    }
                }
                presentation.presenters = newPresenters
                return presentation
            })
            userTempCart = userTempCart.map(cartItem => {
                const newPresenters = []
                for (const id of cartItem.presenters ?? []) {
                    if (id === presenterOrTeacher.id) {
                        newPresenters.push(presenterOrTeacher.name)
                    } else {
                        newPresenters.push(id)
                    }
                }
                for (const id of cartItem.teachers ?? []) {
                    if (id === presenterOrTeacher.id) {
                        newPresenters.push(presenterOrTeacher.name)
                    } else {
                        newPresenters.push(id)
                    }
                }
                if (cartItem.teachers) {
                    cartItem.teachers = newPresenters
                } else {
                    cartItem.presenters = newPresenters
                }
                return cartItem
            })
        }

        setTalks(userTempPresentations)
        setWorkshops(userTempWorkshops)
        setCart(userTempCart)
    }, [userPresentationsData,
        workshopsData,
        presentationsData,
        teachersData,
        presenterData,
        userWorkshopsData])

    return {
        talks,
        workshops,
        removeFromCartHandler,
        cart,
        toastData,
        openToast,
        setOpenToast,
        buyButtonLoading,
        handleBuyCart,
        offCode,
        handleOffCodeInputHandler,
    };
}
