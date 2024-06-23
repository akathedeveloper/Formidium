require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes, Op } = require('sequelize');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend local development URL
  methods: ['GET', 'POST', 'PUT'], // Allow these methods
  allowedHeaders: ['Content-Type'], // Allow these headers
  credentials: true, // Enable credentials
}));
app.use(bodyParser.json());

// Sequelize database connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Important, as Aiven PostgreSQL requires SSL
    },
  },
});

// Define the Invoice model
const Invoice = sequelize.define('Invoice', {
  recipientAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  formidium_address:{
    type: DataTypes.STRING,
    allowNull:false,
    defaultValue:'0xbcDc0883787BA970d450917724CeB73059720265',
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cryptocurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  companyEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoiceCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentDue: {
    type: DataTypes.STRING, // Assuming paymentDue is a string for simplicity
    allowNull: false,
  },
  isPending:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:true, // Default to true as invoices are pending when created
  },
});

const PaymentDetail = sequelize.define('PaymentDetail', {
  paymentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  senderAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recipientAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2), // Example for amount with 2 decimal places
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Invoices',
      key: 'id'
    }
  }
});

// Define the association with Invoice model
PaymentDetail.belongsTo(Invoice, {
  foreignKey: 'invoiceId'
});

// Sync Database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync({alter:true}); // Sync models with database
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  port: 587,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

// Routes

// Create a new invoice
app.post('/api/invoices', async (req, res) => {
  const {
    recipientAddress,
    companyName,
    cryptocurrency,
    dueDate,
    description,
    companyEmail,
    invoiceCategory,
    paymentDue
  } = req.body;

  try {
    const invoice = await Invoice.create({
      recipientAddress,
      companyName,
      cryptocurrency,
      dueDate,
      description,
      companyEmail,
      invoiceCategory,
      paymentDue
    });

    const mailOptions = {
      from: process.env.EMAIL_NAME,
      to: companyEmail,
      subject: 'Invoice Created',
      text: `An invoice has been created. View it here: http://your-domain.com/invoice/${invoice.id}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send email');
    }

    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Fetch all invoices for a recipientAddress
app.get('/user/:recipientAddress/invoices', async (req, res) => {
  const { recipientAddress } = req.params;

  try {
    const invoices = await Invoice.findAll({
      where: {
        recipientAddress: {
          [Op.iLike]: recipientAddress,
        },
      },
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Update payment details for an invoice
app.put('/invoices/:invoiceId/payment', async (req, res) => {
  const { invoiceId } = req.params;
  const { amountPaid, walletAddress } = req.body;

  try {
    const invoice = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const existingPaymentDue = parseFloat(invoice.paymentDue);
    const paymentAmount = parseFloat(amountPaid);

    if (isNaN(existingPaymentDue) || isNaN(paymentAmount)) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    const newPaymentDue = existingPaymentDue - paymentAmount;
    if (newPaymentDue < 0) {
      return res.status(400).json({ error: 'Payment exceeds the amount due' });
    }

    invoice.paymentDue = newPaymentDue.toFixed(4);
    invoice.isPending = newPaymentDue > 0;
    await invoice.save();

    await PaymentDetail.create({
      senderAddress: walletAddress,
      recipientAddress: invoice.recipientAddress,
      amountPaid: paymentAmount,
      invoiceId: invoice.id,
    });

    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error updating invoice paymentDue:', error);
    res.status(500).json({ error: 'Failed to update invoice paymentDue' });
  }
});

// Get pending invoices
app.get('/invoices/pending', async (req, res) => {
  try {
    const pendingInvoices = await Invoice.findAll({
      where: {
        isPending: true
      },
    });
    res.status(200).json(pendingInvoices);
  } catch (error) {
    console.error('Error fetching pending invoices:', error);
    res.status(500).json({ error: 'Failed to fetch pending invoices' });
  }
});

// Get completed invoices
app.get('/invoices/completed', async (req, res) => {
  try {
    const completedInvoices = await Invoice.findAll({
      where: {
        isPending: false
      },
    });
    res.status(200).json(completedInvoices);
  } catch (error) {
    console.error('Error fetching completed invoices:', error);
    res.status(500).json({ error: 'Failed to fetch completed invoices' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
