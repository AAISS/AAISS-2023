import {useAPI} from "../../providers/APIProvider/APIProvider.jsx";
import {useEffect, useState} from "react";
import DateObject from 'react-date-object';
import persian from "react-date-object/calendars/persian";
import persian_en from "react-date-object/locales/persian_en";
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
        let parsedWorkshopData =workshopsData.map(item => {
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
                date: startDate.format("YYYY/MM/DD") + ' UTC+03:30',
                Starts: startDate.format("HH:mm"),
                Ends: endDate.format("HH:mm"),
            }
        })

        const now = Helper.removeEverythingFromDateString(new Date().toLocaleString('fa-IR-u-nu-latn'))
        let index = -1
        for (const item of parsedWorkshopData) {
            const itemDate = Helper.removeEverythingFromDateString(item.date + ", " + item.Starts)
            index++
            if (itemDate > now)
                break
        }
        const notEligibleItems = parsedWorkshopData.slice(0, index)
        parsedWorkshopData = parsedWorkshopData.slice(index)
        parsedWorkshopData.push(...notEligibleItems)
        setTableWorkshopsData(parsedWorkshopData)
    }, [workshopsData])

    useEffect(() => {
        if (presentationsData == null) return
        let parsedPresentations = presentationsData.filter(element => {
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
                date: startDate.format("YYYY/MM/DD") + ' UTC+03:30',
                Starts: startDate.format("HH:mm"),
                Ends: endDate.format("HH:mm"),
            }
        })

        const now = Helper.removeEverythingFromDateString(new Date().toLocaleString('fa-IR-u-nu-latn'))
        let index = -1
        for (const item of parsedPresentations) {
            const itemDate = Helper.removeEverythingFromDateString(item.date + ", " + item.Starts + ":00")
            index++
            if (itemDate > now)
                break
        }
        const notEligibleItems = parsedPresentations.slice(0, index)
        parsedPresentations = parsedPresentations.slice(index)
        parsedPresentations.push(...notEligibleItems)
        setTablePresentationsData(parsedPresentations)
    }, [presentationsData])



    return {
        tableWorkshopsData,
        tablePresentationsData,
    }
}