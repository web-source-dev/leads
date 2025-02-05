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
  Chip,
  Select,
  OutlinedInput,
  FormControl,
  InputLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const industryOptions = [
  { name: "Technology", icon: <AddIcon /> },
  { name: "Healthcare", icon: <AddIcon /> },
  { name: "Education", icon: <AddIcon /> }
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

  const handleIndustrySelect = (selectedIndustry) => {
    setFormData((prevState) => ({
      ...prevState,
      industries: prevState.industries.includes(selectedIndustry)
        ? prevState.industries.filter((industry) => industry !== selectedIndustry)
        : [...prevState.industries, selectedIndustry]
    }));
  };

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
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/lead/buyer`, formData);
        setSuccess('Form submitted successfully')
        setTimeout(() => {
          setSuccess('')
        }, 3000);
        console.log("Form submitted successfully:", response.data);
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
      } catch (error) {
        setError("Error submitting form. Please try again");
        setTimeout(() => {
          setError('')
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
          {["Small", "Medium", "Large"].map((size) => (
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

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ color: "var(--text-color)", mb: 1 }}>
            Select Industries
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {industryOptions.map((option) => (
              <Chip
                key={option.name}
                label={option.name}
                icon={formData.industries.includes(option.name) ? <CloseIcon /> : option.icon}
                onClick={() => handleIndustrySelect(option.name)}
                sx={{
                  backgroundColor: formData.industries.includes(option.name) ? "white" : "var(--background-color)",
                  color: formData.industries.includes(option.name) ? "var(--button-text-color)" : "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  '&:hover': {
                    backgroundColor: formData.industries.includes(option.name) ? "white" : "var(--background-color)",
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {formData.services.map((service, index) => (
          <Box key={index} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ color: "var(--text-color)", mb: 1 }}>
                Service Request {index + 1}
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
            <Grid container spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Select a service"
                  variant="outlined"
                  value={service.service}
                  onChange={(e) => handleServiceChange(index, 'service', e.target.value)}
                  select
                  error={!!errors[`service${index}`]}
                  helperText={errors[`service${index}`]}
                  InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
                  InputProps={{
                    style: {
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                      height: 45,
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
                  {["Consulting", "Development", "Design"].map((serviceOption) => (
                    <MenuItem
                      key={serviceOption}
                      value={serviceOption}
                      style={{
                        backgroundColor: service.service === serviceOption ? "var(--border-color)" : "var(--background-color)",
                        color: service.service === serviceOption ? "var(--button-text-color)" : "var(--text-color)",
                      }}
                    >
                      {serviceOption}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Select a timeframe"
                  variant="outlined"
                  value={service.timeframe}
                  onChange={(e) => handleServiceChange(index, 'timeframe', e.target.value)}
                  select
                  error={!!errors[`timeframe${index}`]}
                  helperText={errors[`timeframe${index}`]}
                  InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
                  InputProps={{
                    style: {
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                      height: 45,
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
                  variant="outlined"
                  value={service.budget}
                  onChange={(e) => handleServiceChange(index, 'budget', e.target.value)}
                  select
                  error={!!errors[`budget${index}`]}
                  helperText={errors[`budget${index}`]}
                  InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '12px' } }}
                  InputProps={{
                    style: {
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                      height: 45,
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
                  {["$1000-$4500", "$4500-$10000", "$10000+"].map((budget) => (
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

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, borderRadius: 2, border: "1px solid var(--border-color1)" }}>
          <IconButton
            color="primary"
            onClick={handleAddService}
            sx={{
              color: "var(--text-color)",
              borderRadius: '45%',
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
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 4,
            backgroundColor: loading ? "#0000ffa3" : "var(--button-background-color)",
            color: 'white',
            height: 45,
            borderRadius: 2,
            border: "1px solid var(--border-color)",
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </Button>

        {error && <Box sx={{ mt: 2, color: 'red' }}>{error}</Box>}
        {success && <Box sx={{ mt: 2, color: 'green' }}>{success}</Box>}
      </Box>

    </Container>
  );
};

export default BuyerForm;

