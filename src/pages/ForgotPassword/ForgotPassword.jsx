import { Button, FormControl } from '@mui/material'
import React from 'react'
import FormTextField from '../../Components/Form/FormTextField'
import '../../css/ForgotPassword.css'
export default function ForgotPassword() {
  return (
    <div class='forgot-container'>
        <FormControl>
            <FormTextField type="text" label="Email"/>
            <Button variant="contained">Send Verification Email</Button>
        </FormControl>
    </div>
  )
}
