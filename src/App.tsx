import React, { useState, useEffect } from 'react';
import aiStrategyData from './aiStrategyData2.json';
import './App.css';
import { jsPDF } from 'jspdf';

// Add this type definition at the top of your file
declare global {
  interface Window {
    jspdf: {
      jsPDF: typeof jsPDF;
    };
  }
}

interface Dimension {
  ID: number;
  Dimension: string;
  Question: string;
  "Conservative Approach": string;
  "Aggressive Approach": string;
  [key: string]: string | number;
}

const App: React.FC = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
  const [activeDimension, setActiveDimension] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      console.log('aiStrategyData:', aiStrategyData);
      setDimensions(aiStrategyData);
    } catch (error) {
      console.error('Error setting dimensions:', error);
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    console.log('dimensions:', dimensions);
  }, [dimensions]);

  const handleSliderChange = (dimensionId: number, newValue: number) => {
    setSliderValues(prev => ({ ...prev, [dimensionId]: newValue }));
  };

  const getApproachLabel = (value: number): string => {
    if (value <= 1) return "Strongly Conservative";
    if (value <= 2) return "Moderately Conservative";
    if (value <= 3) return "Slightly Conservative";
    if (value <= 4) return "Balanced";
    if (value <= 5) return "Slightly Aggressive";
    if (value <= 6) return "Moderately Aggressive";
    return "Strongly Aggressive";
  };

  const getOverallApproach = () => {
    const averageValue = Object.values(sliderValues).reduce((sum, value) => sum + value, 0) / dimensions.length;
    return getApproachKey(averageValue);
  };

  const renderOverallBar = () => {
    const averageValue = Object.values(sliderValues).reduce((sum, value) => sum + value, 0) / dimensions.length;
    const percentage = ((averageValue - 1) / 6) * 100; // Convert to percentage
    return (
      <div className="overall-bar-container">
        <div className="overall-bar-label">Overall Approach:</div>
        <div className="overall-bar">
          <div className="overall-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="overall-bar-labels">
          <span>Conservative</span>
          <span>Aggressive</span>
        </div>
      </div>
    );
  };

  const renderSliders = () => (
    <div className="sliders-container">
      {dimensions.map(dim => (
        <div 
          key={dim.ID} 
          className={`slider-row ${activeDimension === dim.ID ? 'active' : ''}`}
          onClick={() => setActiveDimension(dim.ID)}
        >
          <div className="slider-label">{dim.Dimension.split(':')[0]}</div>
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
          <div className="approach-label">{getApproachLabel(sliderValues[dim.ID] || 4)}</div>
        </div>
      ))}
    </div>
  );

  const getApproachKey = (value: number): string => {
    if (value <= 1) return "Strongly Conservative";
    if (value <= 2) return "Moderately Conservative";
    if (value <= 3) return "Slightly Conservative";
    if (value <= 4) return "Balanced";
    if (value <= 5) return "Slightly Aggressive";
    if (value <= 6) return "Moderately Aggressive";
    return "Strongly Aggressive";
  };
  
  const renderApproachDescriptions = () => (
    <div className="approach-descriptions">
      <h3>Approach Descriptions</h3>
      {activeDimension && (
        <div className="approach-description">
          <h4>{dimensions.find(dim => dim.ID === activeDimension)?.Dimension}</h4>
          <div className="approach-box">
            <p><strong>Conservative:</strong> {dimensions.find(dim => dim.ID === activeDimension)?.["Conservative Approach"]}</p>
            <p><strong>Aggressive:</strong> {dimensions.find(dim => dim.ID === activeDimension)?.["Aggressive Approach"]}</p>
          </div>
          <div className="your-approach-box">
            <p><strong>Your Approach ({getApproachLabel(sliderValues[activeDimension] || 4)}):</strong></p>
            <p>{dimensions.find(dim => dim.ID === activeDimension)?.[`${getApproachKey(sliderValues[activeDimension] || 4)} Approach Feedback` as keyof Dimension]}</p>
          </div>
          <div className="approach-example">
            <p><strong>Example:</strong></p>
            <p>{dimensions.find(dim => dim.ID === activeDimension)?.[`${getApproachKey(sliderValues[activeDimension] || 4)} Example` as keyof Dimension]}</p>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderFeedback = () => (
    <div className="feedback-container">
      <h3>Your Approach Feedback</h3>
      <div className="overall-approach">
        <h4>Overall Approach: {getOverallApproach()}</h4>
        <p>Your AI strategy leans towards a {getOverallApproach().toLowerCase()} approach.</p>
      </div>
      {dimensions.map(dim => (
        <div key={dim.ID}>
          <h4>{dim.Question}</h4>
          <p><strong>Your Approach:</strong> {getApproachLabel(sliderValues[dim.ID] || 4)}</p>
          <p>{dim[`${getApproachKey(sliderValues[dim.ID] || 4)} Approach Feedback` as keyof Dimension]}</p>
        </div>
      ))}
    </div>
  );

  const generatePDF = () => {
    if (typeof window.jspdf === 'undefined') {
      console.error('jsPDF is not available.');
      alert('PDF generation is not available. Please check your internet connection and try again.');
      return;
    }

    try {
      console.log('Starting PDF generation...');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      let yOffset = 20;

      // Add title
      doc.setFontSize(24);
      doc.setTextColor(0, 255, 188); // Bright Turquoise color
      doc.text('AI Strategy Spectrum Tool Results', 10, yOffset);
      yOffset += 20;

      // Add date
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black color
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, yOffset);
      yOffset += 10;

      // Add overall approach
      doc.setFontSize(16);
      doc.setTextColor(0, 177, 255); // Dodger Blue color
      doc.text(`Overall Approach: ${getOverallApproach()}`, 10, yOffset);
      yOffset += 10;

      // Add content
      doc.setFontSize(14);
      doc.setTextColor(27, 47, 60); // Gable Green color
      dimensions.forEach((dim) => {
        if (yOffset > 280) {
          doc.addPage();
          yOffset = 20;
        }
        const approach = getApproachLabel(sliderValues[dim.ID] || 4);
        doc.setFontSize(16);
        doc.text(`${dim.Dimension}`, 10, yOffset);
        yOffset += 10;
        doc.setFontSize(14);
        doc.text(`Your Approach: ${approach}`, 10, yOffset);
        yOffset += 10;
        const feedbackLines = doc.splitTextToSize(dim[`${approach} Approach` as keyof Dimension] as string, 180);
        doc.text(feedbackLines, 10, yOffset);
        yOffset += feedbackLines.length * 7 + 10;
      });

      // Add footer
      const pageCount = (doc as any).internal.pages.length; // This is a workaround
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('AI Strategy Spectrum Tool - Your Company Name', 10, doc.internal.pageSize.height - 10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
      }

      console.log('Saving PDF...');
      doc.save('ai_strategy_results.pdf');
      console.log('PDF generated successfully.');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again later.');
    }
  };

  const sendEmail = () => {
    try {
      const subject = 'AI Strategy Spectrum Tool Results';
      const body = dimensions.map(dim => {
        const approach = getApproachLabel(sliderValues[dim.ID] || 4);
        return `${dim.Dimension}: ${approach}\n${dim[`${approach} Approach` as keyof Dimension]}\n\n`;
      }).join('');

      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to prepare email. Please check the console for details.');
    }
  };

  if (hasError) {
    return <div>Error: Something went wrong. Please check the console for more details.</div>;
  }

  return (
    <div className="App">
      <h1>AI Strategy Spectrum Tool</h1>
      {dimensions.length > 0 ? (
        <>
          {renderOverallBar()}
          <div className="top-container">
            <div className="left-panel">
              {renderSliders()}
            </div>
            <div className="right-panel">
              {renderApproachDescriptions()}
            </div>
          </div>
          {renderFeedback()}
          <div className="action-buttons">
            <button onClick={generatePDF}>Download PDF</button>
            <button onClick={sendEmail}>Send Email</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;