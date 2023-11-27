import { Button, FormControl } from '@mui/material'
import React from 'react'
import FormTextField from '../../components/Form/FormTextField'
import '../../css/ForgotPassword.css'
export default function ForgotPassword() {
  return (
    <div className='forgot-container'>
        <FormControl>
            <FormTextField type="text" label="Email"/>
            <Button variant="contained">Send Verification Email</Button>
        </FormControl>
    </div>
  )
}
