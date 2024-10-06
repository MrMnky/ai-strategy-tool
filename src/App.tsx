import React, { useState, useEffect } from 'react';
import aiStrategyData from './aiStrategyData.json';
import './App.css';

interface Dimension {
  ID: number;
  Dimension: string;
  Question: string;
  "Conservative Approach": string;
  "Aggressive Approach": string;
  "Strongly Conservative": string;
  "Moderately Conservative": string;
  "Slightly Conservative": string;
  Balanced: string;
  "Slightly Aggressive": string;
  "Moderately Aggressive": string;
  "Strongly Aggressive": string;
}

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

  const getFeedback = (dimension: Dimension, value: number): string => {
    if (value < 14.3) return dimension["Strongly Conservative"];
    if (value < 28.6) return dimension["Moderately Conservative"];
    if (value < 42.9) return dimension["Slightly Conservative"];
    if (value < 57.2) return dimension.Balanced;
    if (value < 71.5) return dimension["Slightly Aggressive"];
    if (value < 85.8) return dimension["Moderately Aggressive"];
    return dimension["Strongly Aggressive"];
  };

  return (
    <div className="App">
      <h1>AI Strategy Spectrum Tool</h1>
      {dimensions.map(dim => (
        <div key={dim.ID} className="dimension">
          <h2>{dim.Dimension}</h2>
          <p>{dim.Question}</p>
          <div className="slider-container">
            <span className="approach conservative">{dim["Conservative Approach"]}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValues[dim.ID] || 0}
              onChange={(e) => handleSliderChange(dim.ID, parseInt(e.target.value))}
              className="slider"
            />
            <span className="approach aggressive">{dim["Aggressive Approach"]}</span>
          </div>
          <p className="feedback">Feedback: {getFeedback(dim, sliderValues[dim.ID] || 0)}</p>
        </div>
      ))}
      <h2>Overall Value: {overallValue.toFixed(2)}</h2>
    </div>
  );
};

export default App;