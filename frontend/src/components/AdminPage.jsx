import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    recipientAddress: '',
    companyName: '',
    cryptocurrency: '',
    dueDate: '',
    description: '',
    companyEmail: '',
    invoiceCategory: '',
    paymentDue: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/invoices', formData);
      console.log('Invoice created:', response.data);
      alert('Invoice created successfully');
      // Optionally reset form fields after successful submission
      setFormData({
        recipientAddress: '',
        companyName: '',
        cryptocurrency: '',
        dueDate: '',
        description: '',
        companyEmail: '',
        invoiceCategory: '',
        paymentDue: '',
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice');
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <h2>Make an Invoice</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Recipient Address"
              name="recipientAddress"
              value={formData.recipientAddress}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Cryptocurrency</InputLabel>
              <Select
                name="cryptocurrency"
                value={formData.cryptocurrency}
                onChange={handleChange}
                fullWidth
                required
                MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
              >
                <MenuItem value="">Select Cryptocurrency</MenuItem>
                <MenuItem value="Bitcoin">Bitcoin</MenuItem>
                <MenuItem value="Ethereum">Ethereum</MenuItem>
                <MenuItem value="Litecoin">Litecoin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Email"
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Invoice Category"
              name="invoiceCategory"
              value={formData.invoiceCategory}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Payment Due"
              type="text"
              name="paymentDue"
              value={formData.paymentDue}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Register Invoice
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AdminPage;
