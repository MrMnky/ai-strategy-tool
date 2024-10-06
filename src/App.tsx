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
    if (value < 20) return '#FF0000';
    if (value < 40) return '#FFA500';
    if (value < 60) return '#FFFF00';
    if (value < 80) return '#90EE90';
    return '#008000';
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="value" 
              fill="#8884d8"
              onMouseOver={(data) => {
                if (data && typeof data.value === 'number') {
                  return getColor(data.value);
                }
                return '#8884d8';
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default App;