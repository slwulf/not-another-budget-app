module.exports = {
  database: {
    name: 'not-another-budget-app',
    dialect: 'postgres',
    host: 'localhost',
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    define: { underscoredAll: true, underscored: true }
  }
}
