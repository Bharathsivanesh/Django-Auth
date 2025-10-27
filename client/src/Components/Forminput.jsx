// components/FormInput.jsx
import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const FormInput = ({
  type,
  label,
  value,
  onChange,
  options = [],
  sx = {},
  ...rest
}) => {
  switch (type) {
    case "text":
      return (
        <TextField
          label={label}
          value={value}
          onChange={onChange}
          fullWidth
          sx={sx}
          {...rest}
        />
      );

    case "select":
      return (
        <TextField
          select
          label={label}
          value={value}
          onChange={onChange}
          fullWidth
          sx={sx}
          {...rest}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );

    case "checkbox":
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label={label}
          {...rest}
          sx={sx}
        />
      );
    case "email":
      return (
        <TextField
          type="email"
          label={label}
          value={value}
          onChange={onChange}
          fullWidth
          {...rest}
          sx={sx}
        />
      );

    case "password":
      return (
        <TextField
          type="password"
          label={label}
          value={value}
          onChange={onChange}
          fullWidth
          sx={sx}
          {...rest}
        />
      );

    default:
      return null;
  }
};

export default FormInput;
