import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';
import moment from 'moment';

const PricePredictorChart = ({ priceLocation, marketInputs }) => {
  const [processedData, setProcessedData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const today = moment();

  // Price variations by location (in a real app, this would come from an API)
  const PRICE_VARIATIONS = {
    'EXW_GHANA': { base: 1200, volatility: 50 },
    'CFR_TUTICORIN': { base: 1450, volatility: 70 },
    'CFR_MANGALORE': { base: 1440, volatility: 65 },
    'CFR_VIETNAM': { base: 1380, volatility: 55 },
    'EXW_TANZANIA': { base: 1250, volatility: 45 },
    'EXW_BENIN': { base: 1220, volatility: 48 },
    'CFR_SINGAPORE': { base: 1400, volatility: 60 },
    'CFR_ROTTERDAM': { base: 1500, volatility: 75 }
  };

  useEffect(() => {
    const basePrice = PRICE_VARIATIONS[priceLocation]?.base || 1200;
    const volatility = PRICE_VARIATIONS[priceLocation]?.volatility || 50;

    // Generate past 6 months of historical data
    const historicalData = Array.from({ length: 6 }).map((_, index) => {
      const date = moment().subtract(6 - index, 'months');
      const priceVariation = Math.sin(index) * volatility;
      return {
        date: date.format('YYYY-MM-DD'),
        price: Math.round(basePrice + priceVariation),
        type: 'historical',
        explanation: generateExplanation(date, priceLocation, priceVariation > 0)
      };
    });

    // Generate 3 months of future predictions
    const predictedData = Array.from({ length: 3 }).map((_, index) => {
      const date = moment().add(index + 1, 'months');
      // Apply market intelligence impact to predictions
      const marketImpact = calculateMarketImpact(marketInputs);
      const priceVariation = (Math.sin(index + 6) * volatility) + marketImpact;
      
      return {
        date: date.format('YYYY-MM-DD'),
        price: Math.round(basePrice + priceVariation),
        type: 'predicted',
        explanation: `Predicted based on market intelligence and historical trends`
      };
    });

    const combined = [...historicalData, ...predictedData].map(item => ({
      ...item,
      formattedDate: moment(item.date).format('DD MMM YYYY')
    }));

    setProcessedData(combined);
  }, [priceLocation, marketInputs]);

  const calculateMarketImpact = (inputs) => {
    if (!inputs || inputs.length === 0) return 0;
    
    // Calculate weighted impact from market intelligence inputs
    return inputs.reduce((acc, input) => {
      const weight = input.impactRating / 10; // normalize to 0-1
      const impact = weight * 50; // max impact of 50 points
      return acc + (input.category === 'SUPPLY' ? -impact : impact);
    }, 0);
  };

  const generateExplanation = (date, location, isIncrease) => {
    const events = {
      'EXW_GHANA': [
        'Strong local demand driving prices up',
        'Post-harvest pressure affecting prices',
        'Processing capacity constraints',
        'Export restrictions impact'
      ],
      'CFR_TUTICORIN': [
        'Indian festival season demand',
        'Import duty changes',
        'Container availability issues',
        'Local processing capacity full'
      ],
      // Add more location-specific events
    };

    const locationEvents = events[location] || events['EXW_GHANA'];
    return locationEvents[Math.floor(Math.random() * locationEvents.length)];
  };

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      setSelectedPoint(data.activePayload[0].payload);
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full bg-white p-4 rounded-lg" style={{ height: '500px' }}>
        <ResponsiveContainer>
          <LineChart 
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onClick={handleChartClick}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'USD/MT', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <Card className="bg-white shadow-lg" style={{ maxWidth: '300px' }}>
                      <CardContent>
                        <Typography variant="subtitle2" className="font-bold">
                          {data.formattedDate}
                        </Typography>
                        <Typography variant="h6" className="text-lg font-bold mt-1">
                          USD {data.price}/MT
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <ReferenceLine
              x={today.format('YYYY-MM-DD')}
              stroke="#666"
              strokeDasharray="3 3"
              label={{ 
                value: 'Today',
                position: 'top',
                fill: '#666',
                fontSize: 12
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4, fill: '#2563eb' }}
              name="Historical Price"
              data={processedData.filter(d => d.type === 'historical')}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#059669"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: '#059669' }}
              name="Predicted Price"
              data={processedData.filter(d => d.type === 'predicted')}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {selectedPoint && (
        <Paper className="p-4 bg-white rounded-lg">
          <Typography variant="h6" className="mb-2">
            Market Analysis - {selectedPoint.formattedDate}
          </Typography>
          <Typography variant="body1" className="mb-2">
            Price: USD {selectedPoint.price}/MT
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {selectedPoint.explanation}
          </Typography>
          {selectedPoint.type === 'historical' && (
            <Box className="mt-4 p-4 bg-gray-50 rounded">
              <Typography variant="subtitle2" className="font-bold mb-2">
                Historical Context
              </Typography>
              <Typography variant="body2">
                {generateDetailedAnalysis(selectedPoint, priceLocation)}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </div>
  );
};

const generateDetailedAnalysis = (point, location) => {
  // In a real app, this would pull from a database of historical events
  const analyses = {
    'EXW_GHANA': {
      factors: [
        'Local market dynamics',
        'Weather conditions during harvest',
        'Processing capacity utilization',
        'Export regulations'
      ],
      events: [
        'Farmer selling patterns',
        'Regional political stability',
        'Currency exchange rates',
        'Transportation costs'
      ]
    },
    // Add more location-specific analyses
  };

  const analysis = analyses[location] || analyses['EXW_GHANA'];
  const factors = analysis.factors[Math.floor(Math.random() * analysis.factors.length)];
  const events = analysis.events[Math.floor(Math.random() * analysis.events.length)];

  return `Primary price drivers during this period included ${factors}. Market was particularly influenced by ${events}. This resulted in a ${point.price > 1300 ? 'strengthening' : 'softening'} of prices in the ${location.replace('_', ' ')} market.`;
};

export default PricePredictorChart;