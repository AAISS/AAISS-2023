import useMyAccount from './useMyAccount.js';
import { useConfig } from '../../providers/config-provider/ConfigProvider.jsx';
import { Button } from '@mui/material';
import ObjListTable from '../../components/table/ObjListTable.jsx';

export default function MyAccount() {
  const { sidebarItems, setCurrentlySelectedSidebarItem, currentlySelectedSidebarItem, talks, workshops, basketItems } =
    useMyAccount();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        width: '100%',
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: '30%',
          backgroundColor: 'green',
        }}
      >
        {Object.keys(sidebarItems).map((key, index) => {
          const element = sidebarItems[key];
          return (
            <Button
              style={{
                width: '100%',
                backgroundColor: currentlySelectedSidebarItem.id === element.id ? 'red' : 'blue',
              }}
              key={index}
              onClick={() => setCurrentlySelectedSidebarItem(element)}
            >
              {element.label}
            </Button>
          );
        })}
      </div>
      <div
        style={{
          flex: 5,
          minHeight: '300px',
          backgroundColor: 'red',
        }}
      >
        {currentlySelectedSidebarItem.id === 'basket' && (
          <div>
            <ObjListTable title={currentlySelectedSidebarItem.label} data={basketItems} />
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
            <ObjListTable title={currentlySelectedSidebarItem.label} data={workshops} />
          </div>
        )}
        {currentlySelectedSidebarItem.id === 'talks' && (
          <div>
            <ObjListTable title={currentlySelectedSidebarItem.label} data={talks} />
          </div>
        )}
      </div>
    </div>
  );
}
