import {FormControl, FormLabel, Button} from "@mui/material";
import FormTextField from "../../Components/Form/FormTextField";
import '../../css/Signup.css';

export default function () {


    return (
        <div className="signup-container">
            <div className="signup-box">
                <FormControl>
                    <FormTextField type="text" label="Full Name"/>
                    <FormTextField type="text" label="Email"/>
                    <FormTextField type="text" label="Phone Number"/>
                    <FormTextField type="password" label="Enter Password"/>
                    <FormTextField type="password" label="Re-enter Password"/>
                    <Button color='primary' variant="contained">Submit</Button>
                </FormControl>
            </div>
        </div>
    )
}