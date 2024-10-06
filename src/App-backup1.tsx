import React, { useState } from 'react';
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
  const [activeDimension, setActiveDimension] = useState<number | null>(null);

  const handleSliderChange = (dimensionId: number, newValue: number) => {
    setSliderValues(prev => ({ ...prev, [dimensionId]: newValue }));
  };

  const getApproachLabel = (value: number): string => {
    if (value === 1) return "Strongly Conservative";
    if (value === 2) return "Moderately Conservative";
    if (value === 3) return "Slightly Conservative";
    if (value === 4) return "Balanced";
    if (value === 5) return "Slightly Aggressive";
    if (value === 6) return "Moderately Aggressive";
    return "Strongly Aggressive";
  };

  const renderSliders = () => (
    <div className="sliders-container">
      {dimensions.map(dim => (
        <div 
          key={dim.ID} 
          className={`slider-row ${activeDimension === dim.ID ? 'active' : ''}`}
          onMouseEnter={() => setActiveDimension(dim.ID)}
          onMouseLeave={() => setActiveDimension(null)}
        >
          <div className="slider-label">{dim.Dimension.split(' ')[0]}</div>
          <div className="slider-wrapper">
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={sliderValues[dim.ID] || 4}
              onChange={(e) => handleSliderChange(dim.ID, parseInt(e.target.value))}
              className="slider"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderApproachDescriptions = () => (
    <div className="approach-descriptions">
      <h3>Approach Descriptions</h3>
      {activeDimension && (
        <div className="approach-description">
          <h4>{dimensions.find(dim => dim.ID === activeDimension)?.Dimension}</h4>
          <p><strong>Conservative:</strong> {dimensions.find(dim => dim.ID === activeDimension)?.["Conservative Approach"]}</p>
          <p><strong>Aggressive:</strong> {dimensions.find(dim => dim.ID === activeDimension)?.["Aggressive Approach"]}</p>
        </div>
      )}
    </div>
  );

  const renderFeedback = () => (
    <div className="feedback-container">
      <h3>Your Approach Feedback</h3>
      {dimensions.map(dim => (
        <div key={dim.ID}>
          <h4>{dim.Question}</h4>
          <p><strong>Your Approach:</strong> {getApproachLabel(sliderValues[dim.ID] || 4)}</p>
          <p>{dim[getApproachLabel(sliderValues[dim.ID] || 4) as keyof Dimension]}</p>
        </div>
      ))}
    </div>
  );

  const renderSummary = () => {
    const averageValue = Object.values(sliderValues).reduce((sum, value) => sum + value, 0) / dimensions.length;
    return (
      <div className="summary-container">
        <h3>Overall Approach: {getApproachLabel(Math.round(averageValue))}</h3>
        <p>Your AI strategy leans towards a {getApproachLabel(Math.round(averageValue)).toLowerCase()} approach.</p>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>AI Strategy Spectrum Tool</h1>
      <div className="top-container">
        {renderSliders()}
        {renderApproachDescriptions()}
      </div>
      {renderFeedback()}
      {renderSummary()}
    </div>
  );
};

export default App;