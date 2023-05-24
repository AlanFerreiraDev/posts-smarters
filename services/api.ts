import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://jsonplaceholder.typicode.com',
})
