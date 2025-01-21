import React from 'react';
import HistoryPage from './HistoryPage';

export const VolunteerHistory = () => <HistoryPage apiEndpoint="http://localhost:3001/api/history/volunteer/history" type="volunteer" />;