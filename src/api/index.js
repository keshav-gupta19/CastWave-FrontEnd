import axios from "axios";
// import jwt_decode from "jwt-decode";

const API = axios.create({ baseURL: "http://localhost:3000" });

// auth API
export const signIn = async ({ email, password }) =>
  await API.post("/api/auth/signin", { email, password });

export const signUp = async ({ name, email, password }) => {
  await API.post("/api/auth/signup", { name, email, password });
};
export const googleSignIn = async ({ name, email, img }) => {
  await API.post("/api/auth/google", { name, email, img });
};
export const resetPassword = async (email, password) => {
  await API.post("/api/auth/forgetPassword", { email, password });
};
export const findUserByEmail = async (email) => {
  await API.get(`/api/auth/findByEmail?email=${email}`);
};

// otp
export const generateOtp = async (email, name, reason) => {
  await API.get(
    `/api/auth/generateotp?email=${email}&name=${name}&reason=${reason}`
  );
};
export const verifyOtp = async (otp) => {
  await API.get(`api/auth/verifyotp?code=${otp}`);
};
export const signup = async ({ name, email, password }) =>
  await API.post("/auth/signup", {
    name,
    email,
    password,
  });
