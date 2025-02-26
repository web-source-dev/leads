import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VendorRegistration from './components/VendorForm';
import BuyerForm from './components/BuyerForm';
import VendorDisplayChangeStatus from './components/VendorDisplayChangeStatus';

const App = () => {
  return (
    <Router>
      <div style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
        <Routes>
          <Route path="/vendor" element={<VendorRegistration />} />
          <Route path="/vendor/:email" element={<VendorRegistration />} />
          <Route path="/buyer" element={<BuyerForm />} />
          <Route path="/buyer/:email" element={<BuyerForm />} />
          <Route path="/status/:email" element={<VendorDisplayChangeStatus />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
