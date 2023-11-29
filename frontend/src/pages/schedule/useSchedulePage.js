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
            const startDate = new Date(item["start_date"]).toLocaleString('fa-IR-u-nu-latn')
              .replace(/:\d{2}$/, '')
            const endDate = new Date(item["end_date"]).toLocaleString('fa-IR-u-nu-latn')
              .replace(/:\d{2}$/, '')
            return {
                Title: item.name,
                date: startDate.split(',')[0],
                Starts: startDate.split(',')[1],
                Ends: endDate.split(',')[1],
            }
        }))
    }, [workshopsData])

    useEffect(() => {
        if (presentationsData == null) return
        setTablePresentationsData(presentationsData.filter(element => {
            return element.name != null
        }).map(item => {
            const startDate = new Date(item["start_date"]).toLocaleString('fa-IR-u-nu-latn')
              .replace(/:\d{2}$/, '')
            const endDate = new Date(item["end_date"]).toLocaleString('fa-IR-u-nu-latn')
              .replace(/:\d{2}$/, '')
            return {
                Title: item.name,
                date: startDate.split(',')[0],
                Starts: startDate.split(',')[1],
                Ends: endDate.split(',')[1],
            }
        }))
    }, [presentationsData])

    return {
        tableWorkshopsData,
        tablePresentationsData,
    }
}