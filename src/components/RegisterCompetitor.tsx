import React, { useState } from 'react';

const RegisterCompetitor: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [competitorName, setCompetitorName] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Save the competitor name and perform any necessary actions
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    // Reset the input and cancel the editing
    setCompetitorName('');
    setIsEditing(false);
  };

  return (
    <div style={{margin:'1rem'}}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={competitorName}
            onChange={(e) => setCompetitorName(e.target.value)}
          />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      ) : (
        <div>
        <button onClick={handleEditClick}>Register Competitor</button>
        </div>
      )}
    </div>
  );
};

export default RegisterCompetitor;