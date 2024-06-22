exports.getAllInvoices = (req, res) => {
    res.send('Admin: Get all invoices');
  };
  
  exports.getInvoiceById = (req, res) => {
    res.send(`Admin: Get invoice with ID ${req.params.id}`);
  };
  
  exports.createInvoice = (req, res) => {
    res.send('Admin: Create a new invoice');
  };
  
  exports.updateInvoice = (req, res) => {
    res.send(`Admin: Update invoice with ID ${req.params.id}`);
  };
  
  exports.deleteInvoice = (req, res) => {
    res.send(`Admin: Delete invoice with ID ${req.params.id}`);
  };
  