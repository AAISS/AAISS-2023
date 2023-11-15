import { Button, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import FormTextField from '../../components/Form/FormTextField';
import '../../css/Login.css';

// TODO: do we need this? It's unused.
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <FormControl>
          <FormTextField type="text" label="Email" />
          <FormTextField type="password" label="Password" />
          <FormControlLabel control={<Checkbox />} label="Keep Me Logged In" />

          <a href="/forgotpassword" className="forgot-password">
            <h3>Forgot password?</h3>
          </a>
          <Button color="primary" variant="contained">
            Submit
          </Button>
        </FormControl>
      </div>
    </div>
  );
};

export default Login;
