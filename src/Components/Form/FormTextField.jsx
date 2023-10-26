import React from "react";
import { FormLabel, TextField } from "@mui/material";
import '../../css/FormTextField.css'
export default function FormTextField({ type, label }) {
  return (
    <div className="form-text-item">
      <FormLabel >{label}</FormLabel>
      <TextField type={type} color="primary" />
    </div>
  );
}
