import axios from 'axios'

const base = 'http://localhost:3000/api'

export const Transactions = axios.create({
  baseURL: base + '/transactions'
})

export const Budgets = axios.create({
  baseURL: base + '/budgets'
})
