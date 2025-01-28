import React from "react";
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
      toast.error("Please fill in all fields");
      return;
    }
    if(!formData.agreeToTerms){
      toast.error("Please agree to the terms and conditions");
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
        toast.success("Form submitted successfully!");
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
        toast.error("Error submitting form. Please try again.");
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 2,
        p: 4,
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
          InputLabelProps={{ style: { color: "var(--text-color)",fontSize:'12px' } }}
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
          InputLabelProps={{ style: { color: "var(--text-color)",fontSize:'12px' } }}
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
          InputLabelProps={{ style: { color: "var(--text-color)",fontSize:'12px' } }}
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
          InputLabelProps={{ style: { color: "var(--text-color)",fontSize:'12px' } }}
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
          InputLabelProps={{ style: { color: "var(--text-color)",fontSize:'12px' } }}
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
          InputLabelProps={{ style: { color: "var(--text-color)",fontSize:'12px' } }}
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
          label="Minimum Budget Accepted per Year"
          name="minimumBudget"
          value={formData.minimumBudget}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter minimum budget"
          margin="normal"
          variant="outlined"
          type="number"
          error={!!errors.minimumBudget}
          helperText={errors.minimumBudget}
          InputLabelProps={{ style: { color: "var(--text-color)",fontSize:'12px' } }}
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

        {/* Industries Multi-Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel style={{ color: "var(--text-color)",fontSize:'12px' }}>Industries</InputLabel>
          <Select
            multiple
            value={formData.selectedIndustries}
            onChange={handleIndustryChange}
            style={{
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 45,
              borderRadius: 12,
              fontSize: '12px' // Reduce placeholder size
            }}
            input={<OutlinedInput label="Industries" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    style={{
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                      borderRadius: 60,
                    }}
                  />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "var(--background-color)",
                  color: "var(--text-color)",
                },
              },
            }}
          >
            {industries.map((industry) =>
              (
                <MenuItem
                  key={industry}
                  value={industry}
                  style={{
                    backgroundColor: formData.selectedIndustries.includes(industry) ? "var(--border-color)" : "var(--background-color)",
                    color: formData.selectedIndustries.includes(industry) ? "var(--button-text-color)" : "var(--text-color)",
                  }}
                >
                  {industry}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        {/* Services Multi-Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel style={{ color: "var(--text-color)",fontSize:'12px' }}>Services</InputLabel>
          <Select
            multiple
            value={formData.selectedServices}
            onChange={handleServicesChange}
            style={{
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 45,
              borderRadius: 12,
              fontSize: '12px' // Reduce placeholder size
            }}
            input={<OutlinedInput label="Services" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    style={{
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                      borderRadius: 60,
                    }}
                  />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "var(--background-color)",
                  color: "var(--text-color)",
                },
              },
            }}
          >
            {services.map((service) => (
              <MenuItem
                key={service}
                value={service}
                style={{
                  backgroundColor: formData.selectedServices.includes(service) ? "var(--border-color)" : "var(--background-color)",
                  color: formData.selectedServices.includes(service) ? "var(--button-text-color)" : "var(--text-color)",
                }}
              >
                {service}
              </MenuItem>
            ))}
          </Select>
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
          InputLabelProps={{ style: { color: "var(--text-color)",fontSize:'12px' } }}
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
            color: "var(--button-text-color)",
            height: 45,
            borderRadius: 2,
            border: "1px solid var(--border-color)",
          }}
        >
          {loading ? "Submitting..." : "Register"}
        </Button>
      </Box>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Container>
  );
}
