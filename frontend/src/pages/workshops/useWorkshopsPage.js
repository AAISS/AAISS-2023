import {useCallback, useEffect, useState} from 'react';
import {useAPI} from '../../providers/APIProvider/APIProvider.jsx';

export default function useWorkshopsPage() {
    const {
        getWorkshopsData,
        workshopsData,
        getPresentationsData,
        presentationsData,
        addToCartResponse,
        addItemToCart,
        teachersData,
        getTeachersData,
        presenterData,
        getPresenterData,
        setAddToCartResponse,
    } = useAPI();

    const options = [
        {
            label: "All Items",
            id: "all-items",
        },
        {
            label: "Workshops",
            id: 'workshops',
        },
        {
            label: 'Presentations',
            id: "presentations"
        }
    ]

    const [parsedItemsList, setParsedItemsList] = useState();
    const [fileteredItems, setFileteredItems] = useState();
    const [gridTemplateColumnsValue, setGridTemplateColumnsValue] = useState('');
    const [toastData, setToastData] = useState(false);
    const [openToast, setOpenToast] = useState(false);
    const [filterOption, setFilterOption] = useState(options[0]);
    const [radioSelectedItem, setRadioSelectedItem] = useState(options[0].id)

    const handleCheckbox = useCallback(e => {
        setRadioSelectedItem(e.target.value)
        console.log(e.target.value)
    }, [])

    useEffect(() => {
        const func = () => {
            setGridTemplateColumnsValue('1fr '.repeat(Math.floor(window.innerWidth / 400)));
        };
        func();
        window.addEventListener('resize', func);
    }, []);

    useEffect(() => {
        if (addToCartResponse == null) return;

        const toastDataTemp = {};
        switch (addToCartResponse.status) {
            case 200:
                toastDataTemp.type = 'success';
                toastDataTemp.message = 'Item Successfully Added to Cart!';
                break;
            case 400:
                toastDataTemp.type = 'error';
                toastDataTemp.message = 'Failed to Add Item to Cart: Item Is Already In Your Cart!';
                break;
            case 401:
                toastDataTemp.type = 'error';
                toastDataTemp.message = 'Failed to Add Item to Cart: You Should Login First!';
        }
        setToastData(toastDataTemp);
        setOpenToast(true);
        setAddToCartResponse(null);
    }, [addToCartResponse]);

    useEffect(() => {
        getWorkshopsData();
        getPresentationsData();
        getTeachersData();
        getPresenterData();
    }, [getPresentationsData, getWorkshopsData]);

    useEffect(() => {
        if (workshopsData == null || presentationsData == null || teachersData == null || presenterData == null) return;

        let parsedData = workshopsData
            .concat(presentationsData)
            .map((workshop) => {
                if ('is_full' in workshop && !('id' in workshop)) return null;
                if (workshop.year < 2023) return;
                const item = {};

                const presenters = [];
                if (workshop.teachers) {
                    workshop.teachers.forEach((item) => {
                        presenters.push(teachersData.filter((el) => el.id === item)[0].name);
                    });
                } else {
                    workshop.presenters.forEach((item) => {
                        presenters.push(presenterData.filter((el) => el.id === item)[0].name);
                    });
                }
                item.presenters = presenters;

                item['id'] = workshop.id;
                item['name'] = workshop.name;
                item['start_date'] = workshop.start_date;
                item['end_date'] = workshop.end_date;
                item['level'] = workshop.level;
                item['desc'] = workshop.desc;
                item['isWorkshop'] = !('presenters' in workshop);
                item['capacity'] = workshop.capacity;
                item['cost'] = workshop.cost;
                item['remaining_capacity'] = workshop.remaining_capacity
                return item;
            })
            .filter((e) => e != null);
        parsedData.sort((a, b) => a.start_date > b.start_date ? 1 : -1)

        const now = removeEverythingFromDateString(new Date().toLocaleString('fa-IR-u-nu-latn'))
        let index = -1
        console.log("now:", now)
        for (const item of parsedData) {
            const itemDate = removeEverythingFromDateString(new Date(item.start_date).toLocaleString('fa-IR-u-nu-latn'))
            console.log(itemDate, now, itemDate > now)
            index++
            if (itemDate > now)
                break
        }

        const notEligibleItems = parsedData.slice(0, index)
        parsedData = parsedData.slice(index)
        parsedData.push(...notEligibleItems)
        console.log(parsedData)
        console.log(index)
        setParsedItemsList(parsedData);
        setFileteredItems(parsedData);

        function removeEverythingFromDateString(str) {
            const splittedStr = str.split('/')
            if (splittedStr[1].length === 1)
                splittedStr[1] = '0' + splittedStr[1]
            const secondSplittedStr = splittedStr[2].split(",")
            if (secondSplittedStr[0].length === 1)
                splittedStr[2] = "0" + secondSplittedStr.join(",")
            str = splittedStr.join('/')
            console.log(str)
            return str
                .replaceAll("/", '')
                .replaceAll(" ", '')
                .replaceAll(":", "")
                .replaceAll(",", "")
        }

    }, [workshopsData, presentationsData, presenterData, teachersData]);

    const addToCart = useCallback(
        ({id, type}) => {
            addItemToCart({
                id,
                type,
            });
        },
        [addItemToCart],
    );

    return {
        parsedItemsList,
        addToCart,
        gridTemplateColumnsValue,
        toastData,
        setOpenToast,
        openToast,
        options,
        filterOption,
        setFilterOption,
        handleCheckbox,
        fileteredItems,
        setFileteredItems,
        radioSelectedItem,
    };
}
