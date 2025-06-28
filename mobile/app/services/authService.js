import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.0.2.2:9000/api/auth";

const login = async (credentials) => {
  const { data } = await axios.post(`${API_URL}/login`, credentials);
  await AsyncStorage.setItem("token", data.token); // ✅ store token securely
};

const register = async (userData) => {
  await axios.post(`${API_URL}/register`, userData);
};

const getUserData = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("Token being sent:", token); // 👈 Add this line

  if (!token) throw new Error("No token found");

  const { data } = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};


export default { login, register, getUserData };
