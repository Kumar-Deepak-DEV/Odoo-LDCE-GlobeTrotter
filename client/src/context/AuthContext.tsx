import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem('globetrotter_token');
    if (!savedToken) return;

    try {
      const data = await authApi.getMe();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr?.response?.status === 401) {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    // Check initial auth state from localStorage
    const savedToken = localStorage.getItem('globetrotter_token');
    const savedUser = localStorage.getItem('globetrotter_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('globetrotter_user');
        }
      }
      // Silently refresh user profile from backend
      authApi
        .getMe()
        .then((res) => {
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('globetrotter_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          // Keep cached user if network temporarily unavailable
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('globetrotter_token', newToken);
    localStorage.setItem('globetrotter_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('globetrotter_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

