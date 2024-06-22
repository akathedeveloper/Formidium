require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
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
      model: 'Invoices', // Assuming your Invoice model/table name is 'Invoice'
      key: 'id'         // Assuming 'id' is the primary key of the Invoice table
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
    await sequelize.sync(); // Sync models with database
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
app.post('/api/invoices', async (req, res) => {
  const {
    recipientAddress,
    companyName,
    cryptocurrency,
    dueDate,
    description,
    companyEmail,
    invoiceCategory,
    paymentDue // Added paymentDue to destructuring
  } = req.body;

  try {
    // Create invoice in database
    const invoice = await Invoice.create({
      recipientAddress,
      companyName,
      cryptocurrency,
      dueDate,
      description,
      companyEmail,
      invoiceCategory,
      paymentDue // Include paymentDue in the database entry
    });

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_NAME,
      to: companyEmail,
      subject: 'Invoice Created',
      text: `An invoice has been created. View it here: http://your-domain.com/invoice/${invoice.id}`,
    };

    // Send email
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

app.get('/api/user/:recipientAddress/invoices', async (req, res) => {
  const { recipientAddress } = req.params;

  try {
    // Query invoices for the given recipientAddress
    const invoices = await Invoice.findAll({
      where: {
        recipientAddress: recipientAddress,
      },
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
