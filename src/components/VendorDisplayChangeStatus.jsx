import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorDisplayChangeStatus = () => {
  const [matchedBuyers, setMatchedBuyers] = useState([]);
  const [vendorEmail, setVendorEmail] = useState("baloh12108@bitflirt.com");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendor email from Wix message
  useEffect(() => {
    window.parent.postMessage({ type: "requestData", data: "Send me data" }, "*");

    const handleMessage = (event) => {
      if (event.data.type === "responseData" && event.data.email) {
        setVendorEmail(event.data.email);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Fetch Matched Buyers Data
  useEffect(() => {
    if (!vendorEmail) return; // Avoid API call if email is empty

    const fetchMatchedBuyers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor/${vendorEmail}/match`);
        setMatchedBuyers(response.data.matchedBuyers || []);
      } catch (error) {
        console.error('Error fetching matched buyers:', error);
        setError('Failed to fetch buyers');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedBuyers();
  }, [vendorEmail]);

  // Handle Status Change
  const handleStatusChange = async (buyerEmail, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor/${vendorEmail}/match/${buyerEmail}`, { status });
      setMatchedBuyers((prev) =>
        prev.filter((buyer) => buyer.buyer.email !== buyerEmail)
      );
    } catch (error) {
      console.error('Error updating match status:', error);
      setError('Failed to update status');
    }
  };

  return (
    <div>
      <h2>Matched Buyers</h2>

      {loading && <p>Loading buyers...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && matchedBuyers.length === 0 && <p>No matched buyers found.</p>}

      <ul>
        {matchedBuyers.map(({ buyer, matchReasons, status }) => (
          <li key={buyer.email}>
            <p><strong>Company:</strong> {buyer.companyName}</p>
            <p><strong>Industries:</strong> {buyer.industries.join(', ')}</p>
            <p><strong>Match Reasons:</strong> {matchReasons.join(', ')}</p> 
            <button onClick={() => handleStatusChange(buyer.email, 'active')} disabled={status === 'active'}>
              ✓ Activate
            </button>
            <button onClick={() => handleStatusChange(buyer.email, 'inactive')} disabled={status === 'inactive'}>
              ✗ Deactivate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorDisplayChangeStatus;
