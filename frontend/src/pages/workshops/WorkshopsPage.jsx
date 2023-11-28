import {CircularProgress, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material';
import "../../css/workshops-page.css"
import ItemCard from '../../components/item-card/item-card.jsx';
import Toast from '../../components/toast/Toast.jsx';
import {Helper} from '../../utils/Helper.js';
import useWorkshopsPage from './useWorkshopsPage.js';
import './workshops.css';
import {useCallback} from "react";

export default function WorkshopsPage() {
    const {
        parsedItemsList,
        addToCart,
        gridTemplateColumnsValue,
        toastData,
        setOpenToast,
        openToast,
        radioSelectedItem,
        options,
        filterOption,
        handleCheckbox,
        setFilterOption,
        fileteredItems,
        setFileteredItems,
    } = useWorkshopsPage();

    const handleFilterChange = (option) => {
        setFilterOption(option);

        if (option === 'All Items') {
            setFileteredItems(parsedItemsList);
        } else if (option === 'Workshops') {
            setFileteredItems(parsedItemsList?.filter((item) => item.isWorkshop));
        } else if (option === 'Presentations') {
            setFileteredItems(parsedItemsList?.filter((item) => !item.isWorkshop));
        }
    };

    const getRenderedItems = useCallback((item, index) => {
        return (
            <ItemCard
                key={index}
                isWorkshop={item.isWorkshop}
                title={item.name}
                description={item.desc && Helper.omitLongString(item.desc, 50)}
                purchaseState={0}
                presenterName={item.presenters.join(', ')}
                startDate={new Date(item.start_date).toLocaleString()}
                endDate={new Date(item.end_date).toLocaleString()}
                level={item.level}
                capacity={item.capacity}
                cost={item.cost}
                onClickAddToCart={() =>
                    addToCart({
                        id: item.id,
                        type: item.isWorkshop ? 'workshop' : 'presentation',
                    })
                }
            />
        );
    }, [])

    return (
        <section
        >
            {toastData && (
                <Toast open={openToast} setOpen={setOpenToast} alertType={toastData.type} message={toastData.message}/>
            )}
            {/*<div className="filter-dropdown-container">*/}
            {/*    <select*/}
            {/*        name="filter"*/}
            {/*        id=""*/}
            {/*        className="filter-dropdown-select"*/}
            {/*        value={filterOption}*/}
            {/*        onChange={(e) => handleFilterChange(e.target.value)}*/}
            {/*    >*/}
            {/*        {options.map((option) => (*/}
            {/*            <option key={option} value={option}>*/}
            {/*                {option}*/}
            {/*            </option>*/}
            {/*        ))}*/}
            {/*    </select>*/}
            {/*</div>*/}
            <section style={{
                display: "flex",
                alignItems: "center",
                flexDirection: 'column'
            }}>
                <div>
                    <FormLabel id={"radio-container-workshops-container-label"}>
                        Filter By:
                    </FormLabel>
                    <RadioGroup
                        id={"radio-container-workshops"}
                        value={radioSelectedItem}
                        onChange={handleCheckbox}
                        name={"radio-container-workshops-container-label"}
                    >
                        {options.map((item, index) => (
                            <FormControlLabel
                                value={item.id}
                                control={<Radio/>}
                                key={index}
                                label={item.label}
                            />
                        ))}
                    </RadioGroup>
                </div>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '20px',
                }}>
                    {(radioSelectedItem === "all-items") && fileteredItems &&
                        fileteredItems.map((e, index) => getRenderedItems(e, index))
                    }
                    {(radioSelectedItem === "workshops") && fileteredItems &&
                        fileteredItems.filter(e => e.isWorkshop === true).map((e, index) => getRenderedItems(e, index))
                    }
                    {(radioSelectedItem === "presentations") && fileteredItems &&
                        fileteredItems.filter(e => e.isWorkshop === false).map((e, index) => getRenderedItems(e, index))
                    }
                    {!fileteredItems && <CircularProgress/>}
                </div>
            </section>
        </section>
    );
}
