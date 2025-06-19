import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        return jwtDecode(token);
      } catch {
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("auth/login", {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      toast.success("Login successful!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (username, password, email, phoneNumber) => {
    try {
      await axiosInstance.post("auth/register", {
        username,
        password,
        email,
        phoneNumber,
        roles: ["user"],
      });
      toast.success("Registration successful! Please login.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
