import React from 'react';
import HistoryPage from './HistoryPage';

export const ReceiverHistory = () => <HistoryPage apiEndpoint="http://localhost:3001/api/history/receiver/history" type="receiver" />;