import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import banner from '../../assets/astronaut.png';
import omp from '../../assets/OMPFinex.svg';
import '../../css/Home.css';

const Home = () => {
  return (
    <div className="home">
      <img src={banner} alt="brain-artificial-intelligence" />
      <div id="home-content">
        <Typography id="home-title" pb={2}>
          Amirkabir Artificial Intelligence Student Summit
        </Typography>
        <Typography>
          <a href="https://ceit-ssc.ir" className='ceit-title'>
            CEIT SSC
          </a>
          {' '}
          in colaboration with
          {' '}
          <a href="https://www.ompfinex.com/">
            <img src={omp} alt="OMPFinex logo"
            style={{height: '2rem', display: 'inline'}} />
          </a>
          
        </Typography>
        <Button variant="contained" size="large" id="call-to-action-btn" href="/talks">
          Participate now
        </Button>
        <Button
          variant="contained"
          size="large"
          id="call-to-action-btn"
          href="/talks"
          sx={{
            backgroundColor: '#00b78e',
            '&:hover': {
              backgroundColor: '#00b78e',
            },
          }}
        >
          Compete for the Grand Prize
        </Button>
      </div>
    </div>
  );
};

export default Home;
