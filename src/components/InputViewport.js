import React, { useState, useCallback } from 'react';
import { 
  Paper,
  Typography,
  Slider,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Box,
  FormControl,
  InputLabel
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Upload, Link as LinkIcon } from 'lucide-react';

const IMPACT_CATEGORIES = [
  { value: 'SUPPLY', label: 'Supply Driver' },
  { value: 'DEMAND', label: 'Demand Driver' },
  { value: 'MACRO', label: 'Macro Factor' },
  { value: 'WEATHER', label: 'Weather Impact' }
];

const InputViewport = ({ onDataUpdate }) => {
  const [inputs, setInputs] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newInput = {
          id: Date.now(),
          type: 'file',
          content: reader.result,
          fileName: file.name,
          impactRating: 5,
          category: '',
          date: new Date()
        };
        setInputs(prev => [...prev, newInput]);
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'application/json': ['.json']
    }
  });

  const handleUrlSubmit = (url) => {
    const newInput = {
      id: Date.now(),
      type: 'url',
      content: url,
      impactRating: 5,
      category: '',
      date: new Date()
    };
    setInputs(prev => [...prev, newInput]);
  };

  const handleInputChange = (id, field, value) => {
    setInputs(prev => 
      prev.map(input => 
        input.id === id ? { ...input, [field]: value } : input
      )
    );
    onDataUpdate(inputs);
  };

  const removeInput = (id) => {
    setInputs(prev => prev.filter(input => input.id !== id));
  };

  return (
    <Paper className="p-6 bg-white rounded-lg shadow-sm">
      <Typography variant="h6" className="mb-4">
        Market Intelligence Input
      </Typography>

      <Box className="space-y-6">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <Typography variant="subtitle1" className="mb-2">
            Drop files here or click to upload
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Support for TXT, CSV, PDF, and JSON files
          </Typography>
        </div>

        <div className="relative">
          <TextField
            fullWidth
            label="Add Market News URL"
            variant="outlined"
            placeholder="Paste news article or LinkedIn post URL"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleUrlSubmit(e.target.value);
                e.target.value = '';
              }
            }}
            InputProps={{
              startAdornment: <LinkIcon className="mr-2 text-gray-400" size={20} />,
            }}
          />
        </div>

        <div className="space-y-4">
          {inputs.map(input => (
            <Paper key={input.id} className="p-4 relative" variant="outlined">
              <div className="flex items-center justify-between mb-3">
                <Typography variant="subtitle2" className="font-medium">
                  {input.type === 'file' ? input.fileName : 'Market News URL'}
                </Typography>
                <Chip 
                  label={input.type.toUpperCase()} 
                  size="small"
                  color={input.type === 'file' ? 'primary' : 'secondary'}
                />
              </div>

              <div className="space-y-4">
                <FormControl fullWidth size="small">
                  <InputLabel>Impact Category</InputLabel>
                  <Select
                    value={input.category}
                    onChange={(e) => handleInputChange(input.id, 'category', e.target.value)}
                    label="Impact Category"
                  >
                    {IMPACT_CATEGORIES.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div>
                  <Typography variant="body2" gutterBottom>
                    Expected Impact Rating
                  </Typography>
                  <Slider
                    value={input.impactRating}
                    onChange={(e, value) => handleInputChange(input.id, 'impactRating', value)}
                    min={1}
                    max={10}
                    step={1}
                    marks
                    size="small"
                  />
                </div>

                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={() => removeInput(input.id)}
                >
                  Remove
                </Button>
              </div>
            </Paper>
          ))}
        </div>
      </Box>
    </Paper>
  );
};

export default InputViewport;