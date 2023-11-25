import ItemCard from "../../Components/item-card/item-card.jsx";
import Toast from "../../Components/toast/Toast.jsx";
import {Helper} from "../../utils/Helper.js";
import useWorkshopsPage from "./useWorkshopsPage.js";

export default function WorkshopsPage() {

    const {
        parsedItemsList,
        addToCart,
        gridTemplateColumnsValue,
        toastData,
        setOpenToast,
        openToast,
    } = useWorkshopsPage()

    return (
        <section style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}>
            {toastData && <Toast
                open={openToast}
                setOpen={setOpenToast}
                alertType={toastData.type}
                message={toastData.message}
            />}
            {parsedItemsList && parsedItemsList.map((e, index) => {
                return (
                    <ItemCard
                        key={index}
                        isWorkshop={e.isWorkshop}
                        title={e.name}
                        description={e.desc && Helper.omitLongString(e.desc, 50)}
                        purchaseState={0}
                        presenterName={e.presenters.join(", ")}
                        startDate={new Date(e.start_date).toLocaleString()}
                        endDate={new Date(e.end_date).toLocaleString()}
                        level={e.level}
                        onClickAddToCart={() => addToCart({
                            id: e.id,
                            type: e.isWorkshop ? "workshop" : "presentation"
                        })}
                    />
                )
            })}
        </section>
    )
}