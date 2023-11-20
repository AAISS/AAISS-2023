import ItemCard from "../../Components/item-card/item-card.jsx";
import {Helper} from "../../utils/Helper.js";
import useWorkshopsPage from "./useWorkshopsPage.js";
import {useCallback, useEffect, useState} from "react";

export default function WorkshopsPage() {

    const {
        parsedItemsList,
        addItemToCart,
        gridTemplateColumnsValue,
    } = useWorkshopsPage()

    return (
        <section style={{
            display: "grid",
            gridTemplateColumns: gridTemplateColumnsValue,
            justifyItems: "center",
            width: "80vw",
            gap: "30px",
        }}>
            {parsedItemsList && parsedItemsList.map((e, index) => {
                return (
                    <ItemCard
                        key={index}
                        isWorkshop={e.isWorkshop}
                        title={e.name}
                        description={e.desc && Helper.omitLongString(e.desc, 50)}
                        purchaseState={0}
                        presenterName={e.presenters.join(", ")}
                        startDate={e.start_date}
                        endDate={e.end_date}
                        level={e.level}
                        onClickAddToCart={() => addItemToCart(e.id)}
                    />
                )
            })}
        </section>
    )
}