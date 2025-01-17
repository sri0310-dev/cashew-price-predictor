import React from 'react';
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';

const PRICE_LOCATIONS = [
  { value: 'EXW_GHANA', label: 'Ex-W Ghana' },
  { value: 'CFR_TUTICORIN', label: 'CFR Tuticorin' },
  { value: 'CFR_MANGALORE', label: 'CFR Mangalore' },
  { value: 'CFR_VIETNAM', label: 'CFR Vietnam' },
  { value: 'EXW_TANZANIA', label: 'Ex-W Tanzania' },
  { value: 'EXW_BENIN', label: 'Ex-W Benin' },
  { value: 'CFR_SINGAPORE', label: 'CFR Singapore' },
  { value: 'CFR_ROTTERDAM', label: 'CFR Rotterdam' }
];

const PriceAnalysisControls = ({ priceLocation, setPriceLocation }) => {
  return (
    <Paper className="p-6 bg-white rounded-lg shadow-sm">
      <Typography variant="h6" className="mb-4">
        Price Analysis Settings
      </Typography>
      
      <FormControl fullWidth>
        <InputLabel>Price Location</InputLabel>
        <Select
          value={priceLocation}
          onChange={(e) => setPriceLocation(e.target.value)}
          label="Price Location"
        >
          {PRICE_LOCATIONS.map((location) => (
            <MenuItem key={location.value} value={location.value}>
              {location.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Typography variant="body2" className="mt-4 text-gray-600">
        Select a specific price location to view historical trends and predictions
      </Typography>
    </Paper>
  );
};

export default PriceAnalysisControls;