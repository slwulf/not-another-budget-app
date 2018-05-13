module.exports = (sequelize, DataTypes) => {
  const Budget = sequelize.define('budget', {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  })

  return Budget
}
