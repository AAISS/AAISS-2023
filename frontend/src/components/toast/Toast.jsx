import {useCallback} from "react";
import {Alert, Snackbar} from "@mui/material";
import Slide from '@mui/material/Slide';

export default function Toast({
                                  duration = 6000,
                                  vertical = "top", //'top', 'bottom'
                                  horizontal = "right", //'left', 'center', 'right'
                                  message = "fill me",
                                  alertType = "success",//'error', 'warning', 'info', 'success',
                                  open,
                                  setOpen,
                              }) {


    const onClose = useCallback(() => {
        setOpen(false)
    }, [])

    return (
        <Snackbar
            autoHideDuration={duration}
            open={open}
            onClose={onClose}
            anchorOrigin={{vertical, horizontal}}
            TransitionComponent={(props) => <Slide {...props} direction={"right"}/>}
        >
            <Alert
                sx={{
                    width: "100%",
                }}
                onClose={onClose}
                severity={alertType}>
                {message}
            </Alert>
        </Snackbar>
    )
}