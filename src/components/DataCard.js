// src/components/DataCard.js
import React from 'react';
import './styles/DataCard.css'; // Make sure to create this CSS file

const DataCard = ({ title, value, unit }) => {
    return (
      <div className="data-card">
        <h3>{title}</h3>
        <p>
          {value} {unit}
        </p>
      </div>
    );
  };

  export default DataCard;
