import React, { useState, useRef, useEffect } from "react"
import Logger                    from "@/utils/Logger";
import './Watermark.css';

/**
 * @name Watermark
 * @param {string} text 페턴에 들어갈 문구
 * 
 * @returns {JSX.Element} Watermark
 */
export const Watermark = ({
  text=null,
  ...props
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const HORIZONTAL_SPACING = 560; // Horizontal distance between start of each watermark
  const VERTICAL_SPACING = 320;   // Vertical distance
  
  useEffect(() => {
    Logger.debug(`Watermark > useEffect ... `)
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    // Initial measurement
    updateDimensions();

    // Add resize listener to handle window size changes
    window.addEventListener('resize', updateDimensions);
    return () => {window.removeEventListener('resize', updateDimensions);};
  }, []); // Empty dependency array ensures this runs only once on mount and cleans up on unmount

  const renderWatermarks = () => {
    Logger.debug(`Watermark > renderWatermarks ... dimensions.width: ${dimensions.width || 0}, dimensions.height: ${dimensions.height || 0}`)
    if (!text || dimensions.width === 0 || dimensions.height === 0) {
      return null;
    }

    // Calculate how many rows and columns we need to fill the container
    const numCols = Math.ceil(dimensions.width / HORIZONTAL_SPACING);
    const numRows = Math.ceil(dimensions.height / VERTICAL_SPACING);
    const watermarkElements = [];

    Logger.debug(`Watermark > renderWatermarks ... dimensions.width: ${dimensions.width || 0}, dimensions.height: ${dimensions.height || 0}`)
    // We loop with a small buffer (-1 to +1) to ensure the container is
    // always fully covered, even at the edges after rotation. This is the "safe" part.
    for (let i=0; i < numRows; i++) {
      for (let j=0; j < numCols-1; j++) {
        watermarkElements.push(
          <span key={`${i}-${j}`} className="watermark-text"
            style={{
              // ...styles.watermarkText,
              //
              // top: `${i * VERTICAL_SPACING}px`,
              left: `${100+(j * HORIZONTAL_SPACING)}px`,
            }}
          >
            {text}
          </span>
        );
      }
    }
    return watermarkElements;
  };

  return (
    <div className={`watermark-container ${props.className || ""}`}
      ref={containerRef}
      // style={styles.watermarkContainer}
    >
      {props.children} {/* Render the content to be watermarked */}
      {renderWatermarks()}
    </div>
  );
};

export default Watermark;