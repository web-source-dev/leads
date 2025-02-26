import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, useMediaQuery, Card, CardContent } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const VendorDisplayChangeStatus = () => {
  const [matchedBuyers, setMatchedBuyers] = useState([]);
  const [vendorEmail, setVendorEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

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

  useEffect(() => {
    if (!vendorEmail) return;

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

  const handleStatusChange = async (buyerEmail, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor/${vendorEmail}/match/${buyerEmail}`, { status });
      setMatchedBuyers((prev) => prev.filter((buyer) => buyer.buyer.email !== buyerEmail));
    } catch (error) {
      console.error('Error updating match status:', error);
      setError('Failed to update status');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>Matched Buyers</Typography>
      {loading && <Typography color="primary">Loading buyers...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && matchedBuyers.length === 0 && <Typography color="textSecondary">No matched buyers found.</Typography>}

      {isSmallScreen ? (
        matchedBuyers.map(({ buyer, matchReasons, status }) => (
          <Card key={buyer.email} sx={{position: 'relative' , backgroundColor: '#222', color: '#fff', marginBottom: 2 }}>
            <CardContent>
              <Typography sx={{marginBottom: 2}} variant="h6">{buyer.companyName}</Typography>
              <Typography sx={{marginBottom: 2}} variant="body2">Industry: {buyer.industries.join(', ')}</Typography>
              <Typography sx={{marginBottom: 2}} variant="body2">Match Reasons:</Typography>
              {matchReasons.map((reason, index) => (
                <Chip key={index} label={reason} style={{ margin: 2, backgroundColor: '#444', color: '#fff' }} />
              ))}
              <div style={{ display: 'flex', position: 'absolute', right: 0, top: 0 }} sx={{marginBottom: 2}}>
                <IconButton onClick={() => handleStatusChange(buyer.email, 'active')} disabled={status === 'active'}>
                  <CheckIcon sx={{ mt: 1, color: status === 'active' ? '#666' : '#0f0' }} />
                </IconButton>
                <IconButton onClick={() => handleStatusChange(buyer.email, 'inactive')} disabled={status === 'inactive'}>
                  <CloseIcon sx={{ mt: 1, color: status === 'inactive' ? '#666' : '#f00' }} />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#222', color: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fff' }}><strong>Company</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Industry</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Match Reasons</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matchedBuyers.map(({ buyer, matchReasons, status }) => (
                <TableRow key={buyer.email}>
                  <TableCell sx={{ color: '#fff' }}>{buyer.companyName}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{buyer.industries.join(', ')}</TableCell>
                  <TableCell>
                    {matchReasons.map((reason, index) => (
                      <Chip key={index} label={reason} style={{ margin: 2, backgroundColor: '#444', color: '#fff' }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleStatusChange(buyer.email, 'active')} disabled={status === 'active'}>
                      <CheckIcon sx={{ color: status === 'active' ? '#666' : '#0f0' }} />
                    </IconButton>
                    <IconButton onClick={() => handleStatusChange(buyer.email, 'inactive')} disabled={status === 'inactive'}>
                      <CloseIcon sx={{ color: status === 'inactive' ? '#666' : '#f00' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default VendorDisplayChangeStatus;
