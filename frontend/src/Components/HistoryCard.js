import React from 'react';
import './styles/History.css';

const HistoryCard = ({ donation, type }) => {
  const { donor, volunteer, receiver, donationDetails } = donation;

  const detailsMap = {
    donor: { title: 'Donor Details', details: donor },
    volunteer: { title: 'Volunteer Details', details: volunteer },
    receiver: { title: 'Receiver Details', details: receiver },
  };

  const renderDetails = (role) => {
    const { title, details } = detailsMap[role];
    return (
      <div className="card-section">
        <h3>{title}</h3>
        {details ? (
          <>
            <p><strong>Name:</strong> {details.name}</p>
            <p><strong>Phone:</strong> {details.phone}</p>
            <p><strong>Landmark:</strong> {details.location.landmark}</p>
          </>
        ) : (
          <p className="no-info">No {role} information available</p>
        )}
      </div>
    );
  };

  return (
    <div className="history-card">
      {renderDetails(type)}
      {type !== 'donor' && renderDetails('donor')}
      {type !== 'volunteer' && renderDetails('volunteer')}
      {type !== 'receiver' && renderDetails('receiver')}
      <div className="card-section">
        <h3>Donation Details</h3>
        <p><strong>Quantity:</strong> {donationDetails.quantity}</p>
        <p><strong>Status:</strong> {donationDetails.status}</p>
        <p><strong>Date:</strong> {new Date(donationDetails.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default HistoryCard;