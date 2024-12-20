
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BillingPage from "./components/BillingPage";
import SuccessPage from "./components/SuccessPage";
import FailedPage from "./components/FailedPage";
import CanceledPage from "./components/CanceledPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/billing/:userId" element={<BillingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CanceledPage />} />
        <Route path="/failed" element={<FailedPage />} />
      </Routes>
    </Router>
  );
};

export default App;
