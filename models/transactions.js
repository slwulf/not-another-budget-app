module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('transaction', {
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  })

  return Transaction
}
