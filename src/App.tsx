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

  const getOverallApproach = (value: number): string => {
    if (value < 14.3) return "Strongly Conservative";
    if (value < 28.6) return "Moderately Conservative";
    if (value < 42.9) return "Slightly Conservative";
    if (value < 57.2) return "Balanced";
    if (value < 71.5) return "Slightly Aggressive";
    if (value < 85.8) return "Moderately Aggressive";
    return "Strongly Aggressive";
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
      <div className="overall-approach">
        <h2>Overall Approach: {getOverallApproach(overallValue)}</h2>
        <input
          type="range"
          min="0"
          max="100"
          value={overallValue}
          className="slider"
          disabled
        />
        <div className="slider-labels">
          <span>Conservative</span>
          <span>Aggressive</span>
        </div>
      </div>
      {dimensions.map(dim => (
        <div key={dim.ID} className="dimension">
          <h3>{dim.Question}</h3>
          <div className="approach-comparison">
            <div className="conservative">
              <h4>Conservative</h4>
              <p>{dim["Conservative Approach"]}</p>
            </div>
            <div className="aggressive">
              <h4>Aggressive</h4>
              <p>{dim["Aggressive Approach"]}</p>
            </div>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValues[dim.ID] || 0}
              onChange={(e) => handleSliderChange(dim.ID, parseInt(e.target.value))}
              className="slider"
            />
          </div>
          <div className="your-approach">
            <h4>Your Approach: {getOverallApproach(sliderValues[dim.ID] || 0)}</h4>
            <p>{getFeedback(dim, sliderValues[dim.ID] || 0)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;