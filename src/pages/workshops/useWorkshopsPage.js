import {useEffect, useState} from "react";
import {useAPI} from "../../providers/APIProvider/APIProvider.jsx";

export default function useWorkshopsPage() {
    const {
        getWorkshopsData,
        workshopsData,
    } = useAPI()

    const [parsedWorkshopsData, setParsedWorkshopsData] = useState()

    useEffect(() => {
        getWorkshopsData()
    }, [getWorkshopsData])

    useEffect(() => {
        if (workshopsData == null) return

        //Parse workshopsData into parsedWorkshopsData
        setParsedWorkshopsData(workshopsData)
    }, [workshopsData])

    return {
        parsedWorkshopsData
    }
}