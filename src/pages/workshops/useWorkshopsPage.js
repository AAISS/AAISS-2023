import {useCallback, useEffect, useState} from "react";
import {useAPI} from "../../providers/APIProvider/APIProvider.jsx";

export default function useWorkshopsPage() {
    const {
        getWorkshopsData,
        workshopsData,
        getPresentationsData,
        presentationsData,
        addToCartResultData,
        addItemToCart,
    } = useAPI()

    const [parsedItemsList, setParsedItemsList] = useState()
    const [gridTemplateColumnsValue, setGridTemplateColumnsValue] = useState("")

    useEffect(() => {
        const func = () => {
            setGridTemplateColumnsValue("1fr ".repeat(Math.floor(window.innerWidth / 400)))
        }
        func()
        window.addEventListener("resize", func);
    }, [])

    useEffect(() => {
        getWorkshopsData()
        getPresentationsData()
    }, [getPresentationsData, getWorkshopsData])

    useEffect(() => {
        if (workshopsData == null || presentationsData == null) return

        const parsedData = workshopsData.concat(presentationsData).map(e => {
            if ("is_full" in e && !("id" in e)) return null

            const item = {}
            item["id"] = e.id
            item["name"] = e.name
            item["start_date"] = e.start_date
            item["end_date"] = e.end_date
            item["level"] = e.level
            item.presenters = e.presenters ?? e.teachers
            item["desc"] = e.desc
            item["isWorkshop"] = !("presenters" in e)
            return item
        }).filter(e => e != null)
        console.log(parsedData)
        setParsedItemsList(parsedData)
    }, [workshopsData, presentationsData])

    const addToCart = useCallback(({
                                           id,
                                           type
                                       }) => {
        addItemToCart({
            id,
            type,
        })
    }, [addItemToCart])

    return {
        parsedItemsList,
        addToCart,
        gridTemplateColumnsValue,
    }
}