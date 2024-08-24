import React, { useState } from 'react';

import './NumericInput.css';

interface NumericInputProps {
  initialValue: number;
  onChange: (value: number) => void;
}

const NumericInput: React.FC<NumericInputProps> = ({ initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue);

  const handleIncrement = () => {
    const newValue = value + 1;
    setValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    if (value > 0) {
      const newValue = value - 1;
      setValue(newValue);
      onChange(newValue);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="numeric-input">
      <button onClick={handleDecrement}>-</button>
      <input type="number" value={value} onChange={handleChange} readOnly />
      <button onClick={handleIncrement}>+</button>
    </div>
  );
};

export default NumericInput;