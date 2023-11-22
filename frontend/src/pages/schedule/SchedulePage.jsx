import useSchedulePage from "./useSchedulePage.js";
import ObjListTable from "../../Components/table/ObjListTable.jsx";

export default function SchedulePage() {
    const {
        tableWorkshopsData,
        tablePresentationsData,
    } = useSchedulePage()

    return (
        <main>
            <ObjListTable
                data={tableWorkshopsData}
                title={"Workshops"}
            />
            <ObjListTable
                data={tablePresentationsData}
                title={"Presentations"}
            />
        </main>)
}