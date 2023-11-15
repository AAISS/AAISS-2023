import { FormControl, Button } from '@mui/material';
import FormTextField from '../../components/Form/FormTextField';
import '../../css/Signup.css';

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <FormControl>
          <FormTextField type="text" label="Full Name" />
          <FormTextField type="text" label="Email" />
          <FormTextField type="text" label="Phone Number" />
          <FormTextField type="password" label="Enter Password" />
          <FormTextField type="password" label="Re-enter Password" />
          <Button color="primary" variant="contained">
            Submit
          </Button>
        </FormControl>
      </div>
    </div>
  );
};

export default SignUp;
