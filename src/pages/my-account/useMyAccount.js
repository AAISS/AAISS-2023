import {useCallback, useEffect, useState} from "react";

export default function useMyAccount() {

    const [basketItems, setBasketItems] = useState({})
    const [workshops, setWorkshops] = useState({})
    const [talks, setTalks] = useState({})

    const getUserTalks = useCallback(() => {
        setTalks([
            {
                "id": 1,
                "name": "Discriminative Feature Learning and Face Recognition",
                "desc": "پیش‌نیازهای کارگاه: \r\nKeras, Tensorflow, Convnet",
                "year": 2021,
                "level": "NOT_ASSIGNED",
                "start_date": "2021-08-27T06:00:00Z",
                "end_date": "2021-08-31T18:00:00Z",
                "presenters": []
            },
            {
                "id": 2,
                "name": "A tutorial on evaluating generative models",
                "desc": "A tutorial on evaluating generative models",
                "year": 2021,
                "level": "Elementary",
                "start_date": "2021-08-27T06:00:00Z",
                "end_date": "2021-08-31T18:00:00Z",
                "presenters": [
                    10
                ]
            },
            {
                "id": 3,
                "name": "on the privacy Risks of algorithmic fairness",
                "desc": "on the privacy Risks of algorithmic fairness",
                "year": 2021,
                "level": "NOT_ASSIGNED",
                "start_date": "2021-08-27T06:00:00Z",
                "end_date": "2021-08-30T18:00:00Z",
                "presenters": [
                    11
                ]
            },
        ])
    }, [])

    const getUserWorkshops = useCallback(() => {
        setWorkshops([
            {
                "id": 4,
                "name": "Foundations of Data Augmentation",
                "desc": "Foundations of Data Augmentation",
                "year": 2021,
                "level": "NOT_ASSIGNED",
                "start_date": "2021-08-27T06:00:00Z",
                "end_date": "2021-08-30T18:00:00Z",
                "presenters": [
                    13
                ]
            },
            {
                "id": 5,
                "name": "Representation Learning Without Labels",
                "desc": "Representation Learning Without Labels",
                "year": 2021,
                "level": "NOT_ASSIGNED",
                "start_date": "2021-08-27T06:00:00Z",
                "end_date": "2021-08-30T18:00:00Z",
                "presenters": [
                    16
                ]
            },
            {
                "id": 6,
                "name": "3D CNNs with Adaptive Temporal Feature Resolutions",
                "desc": "3D CNNs with Adaptive Temporal Feature Resolutions",
                "year": 2021,
                "level": "NOT_ASSIGNED",
                "start_date": "2021-08-27T06:00:00Z",
                "end_date": "2021-08-30T18:00:00Z",
                "presenters": [
                    14
                ]
            },
            {
                "id": 7,
                "name": "Learning Representations on Graphs",
                "desc": "Learning Representations on Graphs",
                "year": 2021,
                "level": "NOT_ASSIGNED",
                "start_date": "2021-08-27T06:00:00Z",
                "end_date": "2021-08-30T18:00:00Z",
                "presenters": [
                    17
                ]
            },
            {
                "id": 8,
                "name": "An Introduction to Autonomous Vehicles",
                "desc": "An Introduction to Autonomous Vehicles",
                "year": 2021,
                "level": "NOT_ASSIGNED",
                "start_date": "2021-08-27T06:00:00Z",
                "end_date": "2021-08-30T18:00:00Z",
                "presenters": [
                    18
                ]
            },
        ])
    }, [])

    const basketClickHandler = useCallback(() => {
        setBasketItems([
            {
                "id": 4,
                "name": "Foundations of Data Augmentation",
                "desc": "Foundations of Data Augmentation",
                "year": 2021,
                "level": "NOT_ASSIGNED",
                "start_date": "2021-08-27T06:00:00Z",
                "end_date": "2021-08-30T18:00:00Z",
                "presenters": [
                    13
                ]
            },
        ])
    }, [])

    const sidebarItems = {
        workshops: {
            id: "workshops",
            label: "Workshops",
            command: getUserWorkshops,
        },
        talks: {
            id: "talks",
            label: "Talks",
            command: getUserTalks,
        },
        basket: {
            id: "basket",
            label: "Basket",
            command: basketClickHandler,
        },
    }

    const [currentlySelectedSidebarItem, setCurrentlySelectedSidebarItem] = useState(sidebarItems["workshops"])

    const tabsClickHandler = useCallback((event, newValue) => {
        console.log(newValue)
        setCurrentlySelectedSidebarItem(newValue)
    }, [setCurrentlySelectedSidebarItem])

    useEffect(() => {
        currentlySelectedSidebarItem.command()
    }, [currentlySelectedSidebarItem])

    return {
        sidebarItems,
        setCurrentlySelectedSidebarItem,
        currentlySelectedSidebarItem,
        talks,
        workshops,
        tabsClickHandler,
        basketItems,
    }
}
