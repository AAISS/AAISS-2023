import { blue} from "@mui/material/colors";
import ItemCard from "../../components/item-card/item-card.jsx";
import Toast from "../../components/toast/Toast.jsx";
import {Helper} from "../../utils/Helper.js";
import useWorkshopsPage from "./useWorkshopsPage.js";
import './workshops.css'

export default function WorkshopsPage() {

    const {
        parsedItemsList,
        addToCart,
        gridTemplateColumnsValue,
        toastData,
        setOpenToast,
        openToast,
        options,
        filterOption,
        setFilterOption,
        fileteredItems,
        setFileteredItems
    } = useWorkshopsPage()


    const handleFilterChange = (option) => {
            setFilterOption(option)

            if (option == "All Items"){
                setFileteredItems(parsedItemsList)
            }

            else if (option == 'Workshops'){
                setFileteredItems(parsedItemsList?.filter(item => item.isWorkshop))
            }

            else if (option == 'Presentations'){
                setFileteredItems(parsedItemsList?.filter(item => !item.isWorkshop))
            }
    }

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
            <div className="filter-dropdown-container" style={{
                width: '100%',
                height: '3rem',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <select  name="filter" id="" className="filter-dropdown-select"
                 style={{
                    width: '75%',
                    backgroundColor: blue["50"],
                }}
                    value={filterOption}
                    onChange={(e) => handleFilterChange(e.target.value)}
                >
                     {options.map((option) => (
                        <option key={option} value={option}>
                        {option}
                        </option>
                     ))}
                </select>
            </div>
            {fileteredItems && fileteredItems.map((e, index) => {
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