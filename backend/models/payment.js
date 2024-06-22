module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      paymentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Invoices',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  
    return Payment;
  };
  