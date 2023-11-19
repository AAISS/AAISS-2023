import ItemCard from "../../Components/item-card/item-card.jsx";
import {Helper} from "../../utils/Helper.js";
import useWorkshopsPage from "./useWorkshopsPage.js";

export default function WorkshopsPage() {

    const {
        parsedItemsList
    } = useWorkshopsPage()

    return (
        <>
            {parsedItemsList && parsedItemsList.map((e, index) => {

                return (
                    <ItemCard
                        key={index}
                        isWorkshop={e.isWorkshop}
                        title={e.name}
                        description={e.desc && Helper.omitLongString(e.desc, 100)}
                        purchaseState={0}
                        presenterName={e.presenters.join(", ")}
                        startDate={e.start_date}
                        endDate={e.end_date}
                        level={e.level}
                    />
                )
            })}
        </>
    )
}