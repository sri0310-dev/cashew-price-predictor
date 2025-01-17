import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import PricePredictorChart from './components/PricePredictorChart';
import InputViewport from './components/InputViewport';
import PriceAnalysisControls from './components/PriceAnalysisControls';

function App() {
  const [priceLocation, setPriceLocation] = useState('EXW_GHANA');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [marketInputs, setMarketInputs] = useState([]);

  const handleInputUpdate = (inputs) => {
    // Process and validate market intelligence inputs
    const processedInputs = inputs.map(input => ({
      ...input,
      processed: true,
      validatedAt: new Date()
    }));
    
    setMarketInputs(processedInputs);
    setLastUpdate(new Date());
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" className="mb-8 font-bold">
        Cashew Market Intelligence & Price Prediction
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <div className="space-y-4">
            <PriceAnalysisControls 
              priceLocation={priceLocation}
              setPriceLocation={setPriceLocation}
            />
            
            <PricePredictorChart
              priceLocation={priceLocation}
              marketInputs={marketInputs}
            />
            
            {lastUpdate && (
              <Box className="text-sm text-gray-500 mt-2 text-right">
                Last updated: {lastUpdate.toLocaleString()}
                {marketInputs.length > 0 && ` with ${marketInputs.length} market factors`}
              </Box>
            )}
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <InputViewport onDataUpdate={handleInputUpdate} />
        </Grid>
      </Grid>

      <Box className="mt-8 text-sm text-gray-500">
        All prices are indicative and based on available market intelligence.
        Historical data sources include trade statistics, market reports, and validated inputs.
      </Box>
    </Container>
  );
}

export default App;