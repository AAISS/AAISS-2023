import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAPI } from '../../providers/APIProvider/APIProvider.jsx';
import { useConfig } from '../../providers/config-provider/ConfigProvider.jsx';

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

    const removeFromCartHandler = useCallback(({id, type}) => {
        removeFromUserCart({
            id: id,
            type: type,
        })
    }, [removeFromUserCart])

  const handleBuyCart = useCallback(() => {
    // TODO: this endpoint has some issues
    postPaymentData({ call_back: 'https://aaiss.ir/callback' });
  }, [postPaymentData]);

  useEffect(() => {
    if (paymentData) {
      console.log({ paymentData });
      const { message } = paymentData;
      // TODO: THIS SHOULD BE TESTED ON LIVE TEST!!!!!
      window.location.replace(message);
    }
  }, [paymentData]);

  useEffect(() => {
    if (paymentData == null) return;

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

        console.log(userTempCart)

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
        handleBuyCart,
    };
}
