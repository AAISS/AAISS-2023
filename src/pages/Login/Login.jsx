import {Button, Checkbox, FormControl, FormControlLabel} from "@mui/material";
import FormTextField from "../../Components/Form/FormTextField";
import '../../css/Login.css';

const label = {inputProps: {'aria-label': 'Checkbox demo'}};
export default function () {


    return (
        <div className="login-container">
            <div className="login-box">
                <FormControl>
                    <FormTextField type="text" label="Email"/>
                    <FormTextField type="password" label="Password"/>
                    <FormControlLabel control={<Checkbox/>} label="Keep Me Logged In"/>

                    <a href="/forgotpassword" className="forgot-password">
                        <h3>Forgot password?</h3>
                    </a>
                    <Button color='primary' variant="contained">Submit</Button>
                </FormControl>
            </div>
        </div>
    )
}