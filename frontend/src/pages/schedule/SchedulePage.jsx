import { CircularProgress } from '@mui/material';
import ObjListTable from '../../components/table/ObjListTable.jsx';
import useSchedulePage from './useSchedulePage.js';
import './SchedulePage.css';

export default function SchedulePage() {
  const { tableWorkshopsData, tablePresentationsData } = useSchedulePage();

  if (!tableWorkshopsData || !tablePresentationsData) {
    return (
      <div id="table-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div id="table-container">
      <ObjListTable data={tableWorkshopsData} title={'Workshops'} />
      <ObjListTable data={tablePresentationsData} title={'Presentations'} />
    </div>
  );
}
