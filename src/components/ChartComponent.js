// src/components/ChartComponent.js
import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ type, data, options }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Store chart instance

  useEffect(() => {
    const chartCanvas = chartRef.current;
      if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
      }
    if (chartCanvas) {
      const chartInstance = new Chart(chartCanvas, {
        type: type,
        data: data,
        options: options
      });
        chartInstanceRef.current = chartInstance;
    }

      return () => {
          if(chartInstanceRef.current){
              chartInstanceRef.current.destroy();
          }
      };
  }, [type, data, options]);

  return (
    <canvas ref={chartRef} />
  );
};

export default ChartComponent;
