const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/admin/invoiceController');
const mailController = require('../controllers/admin/mailController');

// Admin invoice routes
router.get('/invoices', invoiceController.getAllInvoices);
router.post('/invoices', invoiceController.createInvoice);
// Admin mail route
router.post('/mail', mailController.sendMail);

module.exports = router;
