import {useAPI} from "../../providers/APIProvider/APIProvider.jsx";
import {useEffect, useState} from "react";
import DateObject from 'react-date-object';
import persian from "react-date-object/calendars/persian";
import persian_en from "react-date-object/locales/persian_en";

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
            const startDate = new DateObject({
                date: new Date(item["start_date"]),
                calendar: persian,
                locale: persian_en,
            })
            const endDate = new DateObject({
                date: new Date(item["end_date"]),
                calendar: persian,
                locale: persian_en,
            })
            return {
                Title: item.name,
                date: startDate.format("YYYY/MM/DD"),
                Starts: startDate.format("HH:mm"),
                Ends: endDate.format("HH:mm"),
            }
        }))
    }, [workshopsData])

    useEffect(() => {
        if (presentationsData == null) return
        setTablePresentationsData(presentationsData.filter(element => {
            return element.name != null
        }).map(item => {
            const startDate = new DateObject({
                date: new Date(item["start_date"]),
                calendar: persian,
                locale: persian_en,
            })
            const endDate = new DateObject({
                date: new Date(item["end_date"]),
                calendar: persian,
                locale: persian_en,
            })
            return {
                Title: item.name,
                date: startDate.format("YYYY/MM/DD"),
                Starts: startDate.format("HH:mm"),
                Ends: endDate.format("HH:mm"),
            }
        }))
    }, [presentationsData])

    return {
        tableWorkshopsData,
        tablePresentationsData,
    }
}