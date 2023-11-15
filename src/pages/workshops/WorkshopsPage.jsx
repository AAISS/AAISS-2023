import useWorkshopsPage from "./useWorkshopsPage.js";

export default function WorkshopsPage() {

    const {
        parsedWorkshopsData
    } = useWorkshopsPage()

    return (
        <pre>
            {JSON.stringify(parsedWorkshopsData, null, 4)}
        </pre>
    )
}