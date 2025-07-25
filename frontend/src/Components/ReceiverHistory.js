import React from "react";
import HistoryPage from "./HistoryPage";

export const ReceiverHistory = () => (
  <HistoryPage
    apiEndpoint="https://annsevaa.onrender.com/api/history/receiver/history"
    type="receiver"
  />
);
