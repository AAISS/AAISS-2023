import React from 'react';
import { TextField } from '@mui/material';
import '../../css/FormTextField.css';

export default function FormTextField({ type, label, value, onChange, error, required = true }) {
  return (
    <TextField
      value={value}
      label={label}
      variant="filled"
      type={type}
      onChange={onChange}
      error={error}
      required={required}
      InputProps={{
        style: { color: 'var(--light-text-color-lighter)' },
      }}
      InputLabelProps={{
        style: { color: 'var(--light-text-color-lighter)' },
      }}
      sx={{
        paddingBottom: 2,
      }}
    />
  );
}
