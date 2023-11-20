import {useCallback, useEffect, useState} from "react";
import {useAPI} from "../../providers/APIProvider/APIProvider.jsx";

export default function useWorkshopsPage() {
    const {
        getWorkshopsData,
        workshopsData,
        getPresentationsData,
        presentationsData,
    } = useAPI()

    const [parsedItemsList, setParsedItemsList] = useState()

    useEffect(() => {
        getWorkshopsData()
        getPresentationsData()
    }, [getPresentationsData, getWorkshopsData])

    useEffect(() => {
        if (workshopsData == null || presentationsData == null) return

        const parsedData = workshopsData.concat(presentationsData).map(e => {
            if ("is_full" in e) return null

            const item = {}
            item["id"] = e.id
            item["name"] = e.name
            item["start_date"] = e.start_date
            item["end_date"] = e.end_date
            item["level"] = e.level
            console.log(e.presenters, e.teachers, e)
            item.presenters = e.presenters ?? e.teachers
            item["desc"] = e.desc
            item["isWorkshop"] = "presenters" in e
            return item
        }).filter(e => e != null)
        console.log(parsedData)
        //Parse workshopsData into parsedWorkshopsData
        setParsedItemsList(parsedData)
    }, [workshopsData, presentationsData])

    const addItemToCart = useCallback(item => {

    }, [])

    return {
        parsedItemsList,
        addItemToCart
    }
}