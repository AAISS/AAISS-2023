import {useAPI} from "../../providers/APIProvider/APIProvider.jsx";
import {useEffect, useState} from "react";
import {Helper} from "../../utils/Helper.js";

export default function useSchedulePage() {
    const {
        getWorkshopsData,
        workshopsData,
        presentationsData,
        getPresentationsData,
    } = useAPI()

    const [tableWorkshopsData, setTableWorkshopsData] = useState()
    const [tablePresentationsData, setTablePresentationsData] = useState()

    useEffect(() => {
        getWorkshopsData()
        getPresentationsData()
    }, [])

    useEffect(() => {
        if (workshopsData == null) return
        setTableWorkshopsData(workshopsData.map(item => {
            const startDate = Helper.convertStringToDateWithoutTimezone(item["start_date"])
            const endDate = Helper.convertStringToDateWithoutTimezone(item["end_date"])
            return {
                Title: item.name,
                date: Helper.convertDateTimeToDate(startDate),
                Starts: Helper.convertDateTimeToTime(startDate),
                Ends: Helper.convertDateTimeToTime(endDate),
            }
        }))
    }, [workshopsData])

    useEffect(() => {
        if (presentationsData == null) return
        setTablePresentationsData(presentationsData.filter(element => {
            return element.name != null
        }).map(item => {
            const startDate = Helper.convertStringToDateWithoutTimezone(item["start_date"])
            const endDate = Helper.convertStringToDateWithoutTimezone(item["end_date"])
            return {
                Title: item.name,
                date: Helper.convertDateTimeToDate(startDate),
                Starts: Helper.convertDateTimeToTime(startDate),
                Ends: Helper.convertDateTimeToTime(endDate),
            }
        }))
    }, [presentationsData])

    return {
        tableWorkshopsData,
        tablePresentationsData,
    }
}