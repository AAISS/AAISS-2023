import { useLocation, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import PresenterProfile from '../../components/presenters/PresenterProfile.jsx';

export default function PresenterDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { teachersArray: teachers } = location.state;
  const currentTeacher = teachers?.find((item) => (item.id = id));

  if (currentTeacher) {
    return (
      <PresenterProfile
        name={currentTeacher.name}
        photo={currentTeacher.pic}
        description={currentTeacher.workplace}
        cvPath={currentTeacher.cv_path}
        bio={currentTeacher.bio}
      />
    );
  }

  return (
    <Typography color="error" sx={{ textAlign: 'center' }}>
      Presenter not found!
    </Typography>
  );
}
