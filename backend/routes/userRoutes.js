const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/users/invoiceController');

// User invoice routes
router.get('/invoices', invoiceController.getAllInvoices);
router.post('/invoices', invoiceController.createInvoice);

module.exports = router;
