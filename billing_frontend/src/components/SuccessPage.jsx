import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const userId = searchParams.get("user_id"); // Retrieve userId from query params
  const navigate = useNavigate();
  const isCalled = useRef(false); // Ref to prevent duplicate calls
  const API_URL = process.env.REACT_APP_API_URL; // Ensure this is defined in the .env file

  useEffect(() => {
    if (!sessionId || !userId) {
      console.error("Missing sessionId or userId in query params.");
      return;
    }

    if (!isCalled.current) {
      isCalled.current = true; // Mark as called
      console.log("Making payment-success API call for session ID:", sessionId);
      axios
        .post(`${API_URL}/api/subscriptions/payment-success`, { sessionId })
        .then(() => {
          console.log("Payment success handled successfully");
        })
        .catch((error) => {
          console.error("Error handling payment success:", error);
        });
    }
  }, [sessionId, userId, API_URL]);

  return (
    <div className="billing-container">
      <h1 className="billing-header">Payment Successful</h1>
      <div className="billing-card">
        <p className="success-message">
          Your subscription has been updated successfully.
        </p>
        <button
          onClick={() => navigate(`/billing/${userId}`)}
          className="button pay-button"
        >
          Go Back to Billing Page
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
