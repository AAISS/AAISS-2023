import useMyAccount from './useMyAccount.js';
import {Button, Tab, Tabs} from '@mui/material';
import ObjListTable from '../../components/table/ObjListTable.jsx';

export default function MyAccount() {
    const {
        sidebarItems,
        tabsClickHandler,
        setCurrentlySelectedSidebarItem,
        currentlySelectedSidebarItem,
        talks,
        workshops,
        basketItems
    } =
        useMyAccount();

    return (
        <div
            style={{
                flexWrap: 'nowrap',
                width: '100%',
            }}
        >
            <Tabs
                style={{
                    flex: 1,
                    backgroundColor: 'green',
                }}
                variant={"fullWidth"}
                value={currentlySelectedSidebarItem}
                onChange={tabsClickHandler}
            >
                {Object.keys(sidebarItems).map((key, index) => {
                    const element = sidebarItems[key];
                    return (
                        <Tab
                            key={index}
                            onClick={() => setCurrentlySelectedSidebarItem(element)}
                            label={element.label}
                        />
                    );
                })}
            </Tabs>
            <div
                style={{
                    flex: 5,
                    minHeight: '300px',
                    backgroundColor: 'red',
                }}
            >
                {currentlySelectedSidebarItem.id === 'basket' && (
                    <div>
                        <ObjListTable title={currentlySelectedSidebarItem.label} data={basketItems}/>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'nowrap',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                            }}
                        >
                            <div>Total: {'5000'}</div>
                            <Button>Buy</Button>
                        </div>
                    </div>
                )}
                {currentlySelectedSidebarItem.id === 'workshops' && (
                    <div>
                        <ObjListTable title={currentlySelectedSidebarItem.label} data={workshops}/>
                    </div>
                )}
                {currentlySelectedSidebarItem.id === 'talks' && (
                    <div>
                        <ObjListTable title={currentlySelectedSidebarItem.label} data={talks}/>
                    </div>
                )}
            </div>
        </div>
    );
}
