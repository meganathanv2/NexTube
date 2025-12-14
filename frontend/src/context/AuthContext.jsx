import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/axiosInstance";

export const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "nexttube_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user || null);
      setAccessToken(parsed.accessToken || null);
      setRefreshToken(parsed.refreshToken || null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, [accessToken]);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;
          const newToken = await refreshSession();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(responseInterceptor);
  }, [refreshToken]);

  const persistAuth = (payload) => {
    setUser(payload.user || null);
    setAccessToken(payload.accessToken || null);
    setRefreshToken(payload.refreshToken || null);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: payload.user || null,
        accessToken: payload.accessToken || null,
        refreshToken: payload.refreshToken || null,
      })
    );
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      persistAuth(data);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const { data } = await api.post("/auth/signup", { username, email, password });
      persistAuth(data);
    } catch (error) {
      throw error;
    }
  };

  const refreshSession = async () => {
    if (!refreshToken) return null;
    try {
      const { data } = await api.post("/auth/refresh", { refreshToken });
      persistAuth(data);
      return data.accessToken;
    } catch {
      logout();
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      loading,
      login,
      signup,
      logout,
      setUserProfile: (nextUser) =>
        persistAuth({ user: nextUser, accessToken, refreshToken }),
    }),
    [user, accessToken, refreshToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

