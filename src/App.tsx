import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import aiStrategyDataImport from './aiStrategyData.json';
import './App.css';

interface Feedback {
  range: number[];
  text: string;
}

interface Dimension {
  id: number;
  dimension: string;
  question: string;
  conservativeApproach: string;
  aggressiveApproach: string;
  feedback: Feedback[];
}

const aiStrategyData: Dimension[] = aiStrategyDataImport as Dimension[];

const App: React.FC = () => {
  const [dimensions] = useState<Dimension[]>(aiStrategyData);
  const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
  const [overallValue, setOverallValue] = useState(0);

  useEffect(() => {
    const total = Object.values(sliderValues).reduce((sum, value) => sum + value, 0);
    const average = total / dimensions.length;
    setOverallValue(average);
  }, [sliderValues, dimensions.length]);

  const handleSliderChange = (dimensionId: number, newValue: number) => {
    setSliderValues(prev => ({ ...prev, [dimensionId]: newValue }));
  };

  const getFeedback = (dimension: Dimension, value: number) => {
    return dimension.feedback.find(f => value >= f.range[0] && value <= f.range[1])?.text || '';
  };

  const getColor = (value: number): string => {
    if (value < 20) return '#FF5F5F'; // Bittersweet
    if (value < 40) return '#17CE95'; // Mountain Meadow
    if (value < 60) return '#00B1FF'; // Dodger Blue
    if (value < 80) return '#00FFBC'; // Bright Turquoise
    return '#6161FF'; // Cornflower Blue
  };

  const chartData = dimensions.map(dim => ({
    name: dim.dimension,
    value: sliderValues[dim.id] || 0,
  }));

  return (
    <div className="App">
      <h1>AI Strategy Spectrum Tool</h1>
      {dimensions.map(dim => (
        <div key={dim.id} className="dimension">
          <h2>{dim.dimension}</h2>
          <p>{dim.question}</p>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValues[dim.id] || 0}
            onChange={(e) => handleSliderChange(dim.id, parseInt(e.target.value))}
          />
          <p>Value: {sliderValues[dim.id] || 0}</p>
          <p>Feedback: {getFeedback(dim, sliderValues[dim.id] || 0)}</p>
        </div>
      ))}
      <h2>Overall Value: {overallValue.toFixed(2)}</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" tick={{ fill: 'white' }} />
            <YAxis tick={{ fill: 'white' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1B2F3C', border: '1px solid #00FFBC' }}
              labelStyle={{ color: 'white' }}
              itemStyle={{ color: 'white' }}
            />
            <Legend wrapperStyle={{ color: 'white' }} />
            <Bar 
              dataKey="value" 
              fill="#00FFBC"
              background={{ fill: 'rgba(0, 255, 188, 0.1)' }}
            >
              {chartData.map((entry, index) => (
                <rect key={`rect-${index}`} fill={getColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default App;