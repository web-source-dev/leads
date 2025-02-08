import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Box,
  Grid,
  Chip,InputLabel, FormControl, Checkbox, ListItemText,Select
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
const industryOptions = [
  { name: "Retail & E-commerce", icon: <AddIcon /> },
  { name: "Marketing & Advertising", icon: <AddIcon /> },
  { name: "Human Resources (HRTech)", icon: <AddIcon /> },
  { name: "Manufacturing & Supply Chain", icon: <AddIcon /> },
  { name: "Real Estate", icon: <AddIcon /> },
  { name: "Professional Services", icon: <AddIcon /> },
  { name: "Insurance & Financial Services", icon: <AddIcon /> },
  { name: "Telecommunications & IT Services", icon: <AddIcon /> },
  { name: "Consumer Goods & Services", icon: <AddIcon /> },
  { name: "Energy & Utilities", icon: <AddIcon /> },
  { name: "Media & Entertainment", icon: <AddIcon /> },
  { name: "Agriculture & Forestry", icon: <AddIcon /> },
  { name: "Information Technology (IT)", icon: <AddIcon /> },
  { name: "Financial Services", icon: <AddIcon /> },
  { name: "Healthcare", icon: <AddIcon /> },
  { name: "Education (EdTech)", icon: <AddIcon /> }
];

const servicesBuyer = [
  "CRM & Sales Automation",
  "Marketing Automation",
  "Cybersecurity & Data Protection",
  "Project Management Software",
  "Business Intelligence & Analytics",
  "Financial & Accounting Tools",
  "HR & Recruitment Solutions",
  "E-commerce Platforms",
  "Document Management & Collaboration Tools",
  "Sales Automation",
  "Customer Support & Helpdesk Tools",
  "Compliance & Risk Management Software"
];

const BuyerForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    companyWebsite: '',
    companySize: '',
    industries: [], // Change from single industry to multiple industries
    additionalInfo: '',
    services: [{ service: '', timeframe: '', budget: '' }]
  });
  console.log(formData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleAddService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { service: '', timeframe: '', budget: '' }]
    });
  };

  const handleRemoveService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: updatedServices });
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData({ ...formData, services: updatedServices });
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
    } else if (name === "companyWebsite" && value) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(value)) {
        error = "Please enter a valid website URL.";
      }
    }
    setErrors({ ...errors, [name]: error });
  };
  // Disable scroll on body when the dropdown is focused
  const handleDropdownFocus = () => {
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  const handleDropdownBlur = () => {
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  const handleIndustrySelect = (selectedIndustry) => {
    setFormData((prevState) => ({
      ...prevState,
      industries: prevState.industries.includes(selectedIndustry)
        ? prevState.industries.filter((industry) => industry !== selectedIndustry)
        : [...prevState.industries, selectedIndustry]
    }));
  };
  const handleDropDownScroll = (event) => {
    event.preventDefault();
    event.stopPropagation();
  }
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    if (!formData.companyName || !formData.firstName || !formData.lastName || !formData.email || !formData.companySize || formData.industries.length === 0 || formData.services.some(service => !service.service || !service.timeframe || !service.budget)) {
      setError("Please fill in all fields");
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
    if (formData.companyWebsite && !urlPattern.test(formData.companyWebsite)) {
      setError('Please enter a valid website URL');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      try {
        // Make the POST request to the backend with form data
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/lead/buyer`, formData);
      
        // Check if the response status is success (HTTP status code 200-299)
        if (response.status >= 200 && response.status < 300) {
          setSuccess('Request submitted. Please check your email for further instructions');
          
          // After success, redirect to the desired URL after 3 seconds
          setTimeout(() => {
            setSuccess('');
            window.top.location.href = "https://www.reachly.ca/";  // Redirection to home page or other URL
          }, 3000);
      
          console.log("Form submitted successfully:", response.data);
      
          // Reset the form data only after successful submission
          setFormData({
            companyName: '',
            firstName: '',
            lastName: '',
            email: '',
            companyWebsite: '',
            companySize: '',
            industries: [],
            additionalInfo: '',
            services: [{ service: '', timeframe: '', budget: '' }]
          });
        } else {
          // Handle case where response status is not in the success range (not 2xx)
          setError("There was an issue with your form submission.");
          setTimeout(() => {
            setError('');
          }, 3000);
        }
      } catch (error) {
        // Handle network errors or any issues during the request
        console.error("Error submitting form:", error);
        setError("Error submitting form. Please try again.");
        setTimeout(() => {
          setError('');
        }, 3000);      
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
        mt: 1,
        p: 2,
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
        borderRadius: 4,
        boxShadow: 3,
      }}
      id="formContainer"
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "var(--text-color)", mb: 1, fontWeight: 'bold' }}
      >
        Service Request
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ color: "var(--text-color)", mb: 1 }}
      >
        Submit your service requirements
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
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 50,
              borderRadius: 12,
              fontSize: '14px' // Reduce placeholder size
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
            InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
            InputProps={{
              style: {
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                height: 50,
                borderRadius: 12,
                fontSize: '14px' // Reduce placeholder size
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
            InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
            InputProps={{
              style: {
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                height: 50,
                borderRadius: 12,
                fontSize: '14px' // Reduce placeholder size
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
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 50,
              borderRadius: 12,
              fontSize: '14px' // Reduce placeholder size
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
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 50,
              borderRadius: 12,
              fontSize: '14px' // Reduce placeholder size
            },
          }}
        />
       <TextField
  fullWidth
  label="Company Size"
  name="companySize"
  value={formData.companySize}
  onChange={handleChange}
  select
  margin="normal"
  variant="outlined"
  error={!!errors.companySize}
  helperText={errors.companySize}
  InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
  InputProps={{
    style: {
      color: "var(--text-color)",
      border: "1px solid var(--border-color)",
      height: 50,
      borderRadius: 12,
      fontSize: '14px' // Reduce placeholder size
    },
  }}
  SelectProps={{
    MenuProps: {
      PaperProps: {
        style: {
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
        },
      },
    },
  }}
  id="companySizeField" // Add an ID to target the input field
   onFocus={() => {
    const element = document.getElementById('companySizeField');
    const container = document.getElementById('formContainer'); // Use container's ID
    if (element && container) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY;
      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const scrollOffset = offsetTop - containerTop - 20; // Adjust for container padding or other elements
      
      // Scroll within the container
      container.scrollTo({ top: scrollOffset, behavior: 'smooth' });
    }
  }}
>
  {["1-50", "51-500", "501-5000", "5,000+"].map((size) => (
    <MenuItem
      key={size}
      value={size}
      style={{
        backgroundColor: formData.companySize === size ? "var(--border-color)" : "var(--background-color)",
        color: formData.companySize === size ? "var(--button-text-color)" : "var(--text-color)",
      }}
    >
      {size}
    </MenuItem>
  ))}
</TextField>

        <Box sx={{ mt: 2, borderRadius: 12 }}>
  <Typography variant="subtitle1" sx={{ color: "var(--text-color)", mb: 1 }}>
    Select Your Industry
  </Typography>
  <FormControl fullWidth>
    <InputLabel 
      id="industry-select-label" 
      sx={{
        color: 'white', // Ensure the default label color is white
        '&.Mui-focused': { color: 'white',backgroundColor:'var(--background-color)', padding:'0px 10px' }, // Ensure label remains white when focused
      }}
    >
      Industries
    </InputLabel>
    <Select
      labelId="industry-select-label"
      multiple
      onClick={handleDropDownScroll}

      onFocus={handleDropDownScroll} // Prevent scrolling on focus
      onBlur={handleDropDownScroll}  // Prevent scrolling on blur
      value={formData.industries}
      onChange={(event) => {
        const selectedIndustries = event.target.value;
        setFormData((prevState) => ({
          ...prevState,
          industries: selectedIndustries
        }));
      }}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap:0.5}}> {/* Reduced gap */}
          {selected.map((industry) => (
            <Chip 
              key={industry} 
              label={industry} 
              sx={{
                backgroundColor: 'var(--background-color)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              }} 
            />
          ))}
        </Box>
      )}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 200, // Limits the dropdown height (around 4 items visible)
            overflowY: 'auto', // Enables the scrollbar
            backgroundColor: 'var(--background-color)', // Apply background color to the dropdown
            zIndex: 1300, // Ensures the dropdown appears above the field
            color: 'var(--text-color)', // Text color for all items
          },
        },
      }}
      sx={{
        color: 'var(--input-text-color)',
        border: '1px solid var(--border-color)',
      }}
    >
      {industryOptions.map((option) => (
        <MenuItem
          key={option.name}
          value={option.name}
          sx={{
            backgroundColor: 'var(--background-color)', // Background color for all items
            '&:hover': {
              backgroundColor: 'var(--background-color)', // Disable hover effect
            },
            '&.Mui-selected': {
              backgroundColor: 'var(--background-color)', // Keep selected item background color
              '&:hover': {
                backgroundColor: 'var(--background-color)', // Ensure hover is disabled on selected
              },
            },
          }}
        >
          <Checkbox checked={formData.industries.includes(option.name)} sx={{ color: 'var(--text-color)' }} />
          <ListItemText primary={option.name} sx={{ color: 'var(--text-color)' }} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>


        <Typography variant="subtitle1" sx={{ color: "var(--text-color)", mt: 2 }}>
        Solutions Required
          </Typography>
        {formData.services.map((service, index) => (
  <Box key={index} sx={{ mt: 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="subtitle2" sx={{ color: "var(--text-color)", mb: 1 }}>
        Solution {index + 1}
      </Typography>
      {index > 0 && (
        <IconButton
          color="secondary"
          onClick={() => handleRemoveService(index)}
          sx={{
            color: "var(--text-color)",
          }}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      )}
    </Box>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Select a service"
          variant="outlined"
          onClick={handleDropDownScroll}

      onFocus={handleDropDownScroll} // Prevent scrolling on focus
      onBlur={handleDropDownScroll}  // Prevent scrolling on blur
          value={service.service}
          onChange={(e) => handleServiceChange(index, 'service', e.target.value)}
          select
          error={!!errors[`service${index}`]}
          helperText={errors[`service${index}`]}
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 50,
              borderRadius: 12,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '14px',
            },
          }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  backgroundColor: "var(--background-color)",
                  color: "var(--text-color)",
                  maxHeight: 200,
                  overflowY: 'auto',
                },
              },
            },
          }}
        >
          {servicesBuyer.map((serviceOption) => (
            <MenuItem
              key={serviceOption}
              value={serviceOption}
              className="responsive-menu-item"
              style={{
                backgroundColor: service.service === serviceOption ? "var(--border-color)" : "var(--background-color)",
                color: service.service === serviceOption ? "var(--button-text-color)" : "var(--text-color)",
                fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              }}
            >
              <Tooltip title={serviceOption} arrow>
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}
                >
                  {serviceOption}
                </span>
              </Tooltip>
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Select a timeframe"
          variant="outlined"
          onClick={handleDropDownScroll}

      onFocus={handleDropDownScroll} // Prevent scrolling on focus
      onBlur={handleDropDownScroll}  // Prevent scrolling on blur
          value={service.timeframe}
          onChange={(e) => handleServiceChange(index, 'timeframe', e.target.value)}
          select
          error={!!errors[`timeframe${index}`]}
          helperText={errors[`timeframe${index}`]}
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 50,
              borderRadius: 12,
            },
          }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  backgroundColor: "var(--background-color)",
                  color: "var(--text-color)",
                },
              },
            },
          }}
        >
          {["1-2 weeks", "1 month", "3 months"].map((timeframe) => (
            <MenuItem
              key={timeframe}
              value={timeframe}
              style={{
                backgroundColor: service.timeframe === timeframe ? "var(--border-color)" : "var(--background-color)",
                color: service.timeframe === timeframe ? "var(--button-text-color)" : "var(--text-color)",
              }}
            >
              {timeframe}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Select a budget"
          onClick={handleDropDownScroll}

      onFocus={handleDropDownScroll} // Prevent scrolling on focus
      onBlur={handleDropDownScroll}  // Prevent scrolling on blur
          variant="outlined"
          value={service.budget}
          onChange={(e) => handleServiceChange(index, 'budget', e.target.value)}
          select
          error={!!errors[`budget${index}`]}
          helperText={errors[`budget${index}`]}
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              height: 50,
              borderRadius: 12,
            },
          }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  backgroundColor: "var(--background-color)",
                  color: "var(--text-color)",
                },
              },
            },
          }}
        >
          {["$5,000+", "$10,000+", "$25,000+","50,000+","100,000+"].map((budget) => (
            <MenuItem
              key={budget}
              value={budget}
              style={{
                backgroundColor: service.budget === budget ? "var(--border-color)" : "var(--background-color)",
                color: service.budget === budget ? "var(--button-text-color)" : "var(--text-color)",
              }}
            >
              {budget}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  </Box>
))}

        <Box onClick={handleAddService} sx={{ display: 'flex', justifyContent: 'center',cursor:'pointer', mt: 3, borderRadius: 2, border: "1px solid var(--border-color1)" }}>
          <IconButton
            color="primary"
            onClick={handleAddService}
            sx={{
              color: "var(--text-color)",
              borderRadius: '50%',
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
          <Typography
            variant="body1"
            sx={{ color: "var(--text-color)", ml: 1, alignSelf: 'center' }}
          >
            Add Another Service
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Additional Information"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Provide additional details about your requirements"
          margin="normal"
          multiline
          rows={4}
          variant="outlined"
          error={!!errors.additionalInfo}
          helperText={errors.additionalInfo}
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              borderRadius: 12,
              fontSize: '14px' // Reduce placeholder size
            },
          }}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 4,
            backgroundColor: loading ? "#0000ffa3" : "var(--button-background-color)",
            color: 'white', // Ensure text color is always white
            height: 50,
            borderRadius: 2,
            border: "1px solid var(--border-color)",
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? <span style={{ color: 'white' }}>Submitting...</span> : "Submit Request"}
        </Button>

        {error && <Box sx={{ mt: 2, color: 'red' }}>{error}</Box>}
        {success && <Box sx={{ mt: 2, color: 'green' }}>{success}</Box>}
      </Box>

    </Container>
  );
};

export default BuyerForm;
