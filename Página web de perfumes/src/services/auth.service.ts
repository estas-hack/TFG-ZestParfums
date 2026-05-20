import api from "../api/axios";
import { JwtResponse } from "../types/auth";

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

const persistAuth = (data: JwtResponse) => {
  if (typeof window === "undefined") return;
  if (data.token) {
    const normalizedEmail = data.email.trim().toLowerCase();
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", normalizedEmail);
    localStorage.setItem("isAdmin", data.esAdmin.toString());
    window.dispatchEvent(new Event("userCartChange"));
  }
};

const login = async (email: string, password: string): Promise<JwtResponse> => {
  try {
    const response = await api.post<JwtResponse>("/auth/login", {
      email,
      password,
    });

    persistAuth(response.data);
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || new Error("Error en la conexión con el servidor")
    );
  }
};

const register = async (payload: RegisterRequest): Promise<JwtResponse> => {
  try {
    const response = await api.post<JwtResponse>("/auth/register", payload);
    persistAuth(response.data);
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || new Error("Error en la conexión con el servidor")
    );
  }
};

const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    window.dispatchEvent(new Event("userCartChange"));
  }
  window.location.replace("/");
};

export default { login, logout, register };
