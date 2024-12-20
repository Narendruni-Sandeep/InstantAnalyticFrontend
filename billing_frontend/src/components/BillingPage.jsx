import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BillingPage = () => {
  const { userId } = useParams(); // Retrieve userId from URL
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(87);
  const [couponMessage, setCouponMessage] = useState("");
  const [billingHistory, setBillingHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL; // Ensure this is defined in .env file

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing from the URL.");
      return;
    }

    axios
      .get(`${API_URL}/api/subscriptions/${userId}`)
      .then((response) => {
        setSubscription(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subscription details:", error);
        setLoading(false);
      });
  }, [userId, API_URL]);

  const applyCoupon = () => {
    axios
      .post(`${API_URL}/api/coupons/validate`, { couponCode })
      .then((response) => {
        const discountAmount = response.data.discount / 100;
        setDiscount(discountAmount);
        setTotalAmount(87 - discountAmount);
        setCouponMessage("Coupon applied successfully!");
      })
      .catch((error) => {
        setCouponMessage(
          error.response?.data?.message || "Invalid coupon code."
        );
        setDiscount(0);
        setTotalAmount(87);
      });
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponMessage("");
    setDiscount(0);
    setTotalAmount(87);
  };

  const handlePayNow = () => {
    axios
      .post(`${API_URL}/api/subscriptions/create-checkout-session`, {
        userId,
        couponCode,
      })
      .then((response) => {
        window.location.href = response.data.url;
      })
      .catch((error) => {
        console.error("Error creating checkout session:", error);
      });
  };

  const fetchBillingHistory = () => {
    axios
      .get(`${API_URL}/api/payments/${userId}`)
      .then((response) => {
        setBillingHistory(response.data);
        setShowHistory(true);
      })
      .catch((error) => {
        console.error("Error fetching billing history:", error);
      });
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="billing-container">
      <h1 className="billing-header">Billing Page</h1>
      {subscription ? (
        <div className="billing-card">
          <p>Status: {subscription.status}</p>
          <p>Start Date: {subscription.startDate}</p>
          <p>End Date: {subscription.endDate}</p>
          <p>Total Amount: ${totalAmount.toFixed(2)}</p>
          <input
            type="text"
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={discount > 0}
            className="coupon-input"
          />
          {discount === 0 ? (
            <button onClick={applyCoupon} className="button apply-button">
              Apply Coupon
            </button>
          ) : (
            <button onClick={removeCoupon} className="button remove-button">
              Remove Coupon
            </button>
          )}
          {couponMessage && <p className="coupon-message">{couponMessage}</p>}
          <button onClick={handlePayNow} className="button pay-button">
            Pay Now
          </button>
          <button
            onClick={fetchBillingHistory}
            className="button history-button"
          >
            {showHistory ? "Hide Billing History" : "View Billing History"}
          </button>
          {showHistory && (
            <div className="billing-history">
              <h2>Billing History</h2>
              <ul>
                {billingHistory.map((payment) => (
                  <li key={payment.id} className="billing-history-item">
                    <p>Transaction ID: {payment.transactionId}</p>
                    <p>Amount Paid: ${(payment.amountPaid / 100).toFixed(2)}</p>
                    <p>Payment Date: {payment.paymentDate}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="no-data">No subscription data found.</p>
      )}
    </div>
  );
};

export default BillingPage;
