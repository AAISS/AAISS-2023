import React from "react";
import { FormLabel, TextField } from "@mui/material";
import '../../css/FormTextField.css'
export default function FormTextField({ type, label }) {
  return (
    <div className="form-text-item">
      {/* <FormLabel style={{color: "white"}}>{label}</FormLabel> */}
      <TextField label={label} variant='standard' type={type} InputProps={{
        style: { color: 'white' },
      }}
      InputLabelProps={{
        style: { color: 'white' },
      }}
      />
    </div>
  );
}
