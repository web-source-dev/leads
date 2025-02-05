import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Chip,
  InputLabel,
  FormControl,
  OutlinedInput,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios"; // Import axios for HTTP requests
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const industries = ["Technology", "Healthcare", "Finance", "Education", "Retail"];
const services = [
  "Consulting",
  "Software Development",
  "Marketing",
  "Design",
  "Support",
];

export default function VendorRegistration() {
  const [formData, setFormData] = React.useState({
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyWebsite: "",
    minimumBudget: "",
    selectedIndustries: [],
    selectedServices: [],
    additionalInfo: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleIndustryChange = (event) => {
    setFormData({ ...formData, selectedIndustries: event.target.value });
  };

  const handleServicesChange = (event) => {
    setFormData({ ...formData, selectedServices: event.target.value });
  };

  const [error,setError] = useState('')
  const [success,setSuccess] = useState('')
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    let error = "";
    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        error = "Please enter a valid email address.";
      }
    } else if (name === "phone") {
      const phonePattern = /^[0-9]+$/;
      if (!phonePattern.test(value)) {
        error = "Please enter a valid phone number.";
      }
    } else if (name === "companyWebsite" && value) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(value)) {
        error = "Please enter a valid website URL.";
      }
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const phonePattern = /^[0-9]+$/;

    if (!formData.companyName || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.minimumBudget || formData.selectedIndustries.length === 0 || formData.selectedServices.length === 0) {
      setError("Please fill in all fields");
      setTimeout(() => {
        setError("")
      }, 3000);
      return;
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      setTimeout(() => {
        setError("")
      }, 3000);
      return;
    }
    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!phonePattern.test(formData.phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (formData.companyWebsite && !urlPattern.test(formData.companyWebsite)) {
      toast.error("Please enter a valid website URL.");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor`, formData);
        setSuccess("Request submitted successfully!");
        setTimeout(() => {
          setSuccess("")
          window.top.location.href = "https://www.reachly.ca/";
        }, 3000);
        console.log("Form submitted successfully:", response.data);
        setFormData({
          companyName: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          companyWebsite: "",
          minimumBudget: "",
          selectedIndustries: [],
          selectedServices: [],
          additionalInfo: "",
          agreeToTerms: false,
        });
      } catch (error) {
        setError('Email Already Exists or Invalid Attempt');
        setTimeout(() => {
          setError("")
        }, 3000);
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const toggleSelection = (type, value) => {
    setFormData((prevState) => {
      const selectedItems = prevState[type].includes(value)
        ? prevState[type].filter((item) => item !== value)
        : [...prevState[type], value];
      return { ...prevState, [type]: selectedItems };
    });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 1,
        p: 2,
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "var(--text-color)", mb: 1, fontWeight: 'bold' }}
      >
        Vendor Registration
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ color: "var(--text-color)", mb: 1 }}
      >
        Register your company as a service provider
      </Typography>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ mt: 1 }}
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your company name"
          margin="normal"
          variant="outlined"
          error={!!errors.companyName}
          helperText={errors.companyName}
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 45,
              borderRadius: 12,
              fontSize: '12px' // Reduce placeholder size
            },
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your first name"
            margin="normal"
            variant="outlined"
            error={!!errors.firstName}
            helperText={errors.firstName}
            InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
            InputProps={{
              style: {
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                height: 45,
                borderRadius: 12,
                fontSize: '12px' // Reduce placeholder size
              },
            }}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your last name"
            margin="normal"
            variant="outlined"
            error={!!errors.lastName}
            helperText={errors.lastName}
            InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
            InputProps={{
              style: {
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                height: 45,
                borderRadius: 12,
                fontSize: '12px' // Reduce placeholder size
              },
            }}
          />
        </Box>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email address"
          type="email"
          margin="normal"
          variant="outlined"
          error={!!errors.email}
          helperText={errors.email}
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 45,
              borderRadius: 12,
              fontSize: '12px' // Reduce placeholder size
            },
          }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your phone number"
          type="tel"
          margin="normal"
          variant="outlined"
          error={!!errors.phone}
          helperText={errors.phone}
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 45,
              borderRadius: 12,
              fontSize: '12px' // Reduce placeholder size
            },
          }}
        />
        <TextField
          fullWidth
          label="Company Website"
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://example.com"
          margin="normal"
          variant="outlined"
          error={!!errors.companyWebsite}
          helperText={errors.companyWebsite}
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 45,
              borderRadius: 12,
              fontSize: '12px' // Reduce placeholder size
            },
          }}
        />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.minimumBudget}>
          <InputLabel style={{ color: "var(--text-color)", fontSize: '12px' }}>
            Minimum Budget Accepted per Year
          </InputLabel>
          <Select
            name="minimumBudget"
            value={formData.minimumBudget}
            onChange={handleChange}
            onBlur={handleBlur}
            displayEmpty
            style={{
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              backgroundColor: "#121212",
              height: 45,
              borderRadius: 12,
              fontSize: '12px'
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#121212", // Background color for dropdown menu
                },
              },
            }}
          >
            <MenuItem style={{ backgroundColor: "#121212", color: "white" }} value="" disabled></MenuItem>
            <MenuItem style={{ backgroundColor: "#121212", color: "white" }} value="10000">$10,000</MenuItem>
            <MenuItem style={{ backgroundColor: "#121212", color: "white" }} value="25000">$25,000</MenuItem>
            <MenuItem style={{ backgroundColor: "#121212", color: "white" }} value="50000">$50,000</MenuItem>
            <MenuItem style={{ backgroundColor: "#121212", color: "white" }} value="100000">$100,000+</MenuItem>
          </Select>
        </FormControl>
        {/* Industries Multi-Select */}
        <InputLabel style={{ color: "var(--text-color)", fontSize: '14px', fontWeight: 'bold', mt: 2 }}>Select Industries</InputLabel>
        <FormControl fullWidth margin="normal">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {industries.map((industry) => (
              <Chip
                key={industry}
                label={industry}
                onClick={() => toggleSelection('selectedIndustries', industry)}
                icon={formData.selectedIndustries.includes(industry) ? <CloseIcon /> : <AddIcon />}
                style={{
                  backgroundColor: formData.selectedIndustries.includes(industry) ? "white" : "var(--background-color)",
                  color: formData.selectedIndustries.includes(industry) ? "black" : "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 20,
                  cursor: 'pointer',
                  padding: '0 8px',
                  height: 30,
                }}
              />
            ))}
          </Box>
        </FormControl>

        {/* Services Multi-Select */}
        <InputLabel style={{ color: "var(--text-color)", fontSize: '14px', fontWeight: 'bold', mt: 2 }}>Services</InputLabel>
        <FormControl fullWidth margin="normal">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {services.map((service) => (
              <Chip
                key={service}
                label={service}
                onClick={() => toggleSelection('selectedServices', service)}
                icon={formData.selectedServices.includes(service) ? <CloseIcon /> : <AddIcon />}
                style={{
                  backgroundColor: formData.selectedServices.includes(service) ? "white" : "var(--background-color)",
                  color: formData.selectedServices.includes(service) ? "black" : "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 20,
                  cursor: 'pointer',
                  padding: '0 8px',
                  height: 30,
                }}
              />
            ))}
          </Box>
        </FormControl>

        <TextField
          fullWidth
          label="Additional Information"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Provide additional details about your company or services"
          margin="normal"
          multiline
          rows={4}
          variant="outlined"
          error={!!errors.additionalInfo}
          helperText={errors.additionalInfo}
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              borderRadius: 12,
              fontSize: '12px' // Reduce placeholder size
            },
          }}
        />

        {/* Agree to Terms */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.agreeToTerms}
              onChange={handleCheckboxChange}
              name="agreeToTerms"
              style={{ color: "var(--text-color)" }}
            />
          }
          label={
            <Typography style={{ color: "var(--text-color)" }}>
              I agree to the terms and conditions
            </Typography>
          }
        />

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            mt: 4,
            backgroundColor: loading ? "gray" : "var(--button-background-color)",
            color:   loading ? "white" : "var(--button-text-color)",
            height: 45,
            borderRadius: 2,
            border: "1px solid var(--border-color)",
          }}
        >
          {loading ? "Submitting..." : "Register"}
        </Button>
        {/* error color red */}
        {error && <Box sx={{ mt: 2, color:'red' }}>{error}</Box>}
        {/* success color green */}
        {success && <Box sx={{ mt: 2, color:'green' }}>{success}</Box>}
      </Box>
    </Container>
  );
}
