import { useNavigate } from 'react-router';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import banner from '../../assets/Brain.png';
import '../../css/Home.css';

const Home = () => {
  let navigate = useNavigate();
  const routeChange = () => {
    navigate('/workshops');
  };

  return (
    <div className="home">
      <img src={banner} alt="brain-artificial-intelligence" />
      <div id="home-content">
        <Typography id="home-title" pb={2}>
          Amirkabir Artificial Intelligence Student Summit
        </Typography>
        <Button variant="contained" size="large" id="call-to-action-btn" onClick={routeChange}>
          Register now
        </Button>
      </div>
    </div>
  );
};

export default Home;
