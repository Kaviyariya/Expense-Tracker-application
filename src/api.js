import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api" });

export const loginUser = (username, password) =>
  API.post("/users/login", { username, password });

export const registerUser = (username, password) =>
  API.post("/users/register", { username, password });

export const getExpenses = (username) =>
  API.get(`/expenses/${username}`);

export const addExpense = (username, expense) =>
  API.post(`/expenses/${username}`, expense);

export const updateExpense = (id, expense) =>
  API.put(`/expenses/${id}`, expense);

export const deleteExpense = (id) =>
  API.delete(`/expenses/${id}`);
