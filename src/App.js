import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VendorRegistration from './components/VendorForm';
import BuyerForm from './components/BuyerForm';

const App = () => {
  return (
    <Router>
      <div style={{ padding: "1rem", backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
        <Routes>
          <Route path="/vendor" element={<VendorRegistration />} />
          <Route path="/vendor/:email" element={<VendorRegistration />} />
          <Route path="/buyer" element={<BuyerForm />} />
          <Route path="/buyer/:email" element={<BuyerForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
