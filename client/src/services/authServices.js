import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// REGISTER USER
export const registerUser = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
};

// LOGIN USER
export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};