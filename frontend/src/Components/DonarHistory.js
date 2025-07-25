import React from "react";
import HistoryPage from "./HistoryPage";

export const DonorHistory = () => (
  <HistoryPage
    apiEndpoint="https://annsevaa.onrender.com/api/history/donor/history"
    type="donor"
  />
);
