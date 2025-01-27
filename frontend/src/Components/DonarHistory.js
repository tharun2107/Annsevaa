import React from "react";
import HistoryPage from "./HistoryPage";

export const DonorHistory = () => (
  <HistoryPage
    apiEndpoint="http://localhost:3001/api/history/donor/history"
    type="donor"
  />
);
