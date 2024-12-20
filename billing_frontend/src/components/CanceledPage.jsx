import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CanceledPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id"); // Retrieve userId from query params

  const handleNavigate = () => {
    if (userId) {
      navigate(`/billing/${userId}`); // Navigate to billing page with userId
    } else {
      console.error("User ID is missing in query params.");
      navigate("/billing"); // Fallback to billing page without userId
    }
  };

  return (
    <div className="billing-container">
      <h1 className="billing-header">Payment Canceled</h1>
      <div className="billing-card">
        <p className="error-message">
          You have canceled your payment. No changes have been made to your subscription.
        </p>
        <button onClick={handleNavigate} className="button history-button">
          Go Back to Billing Page
        </button>
      </div>
    </div>
  );
};

export default CanceledPage;
