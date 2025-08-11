import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from '../services/mockApi';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password?: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    try {
      const item = window.localStorage.getItem('currentUser');
      setCurrentUser(item ? JSON.parse(item) : null);
    } catch (error) {
      setCurrentUser(null);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      if (currentUser) {
        window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } else if (currentUser === null) {
        window.localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error("Could not save user to local storage", error);
    }
  }, [currentUser]);

  const login = async (username: string, password?: string) => {
    setLoading(true);
    try {
      const user = await api.login(username, password);
      if (user) {
        setCurrentUser(user);
        return user;
      }
      setCurrentUser(null);
      return null;
    } catch (error) {
      console.error("Login failed", error);
      setCurrentUser(null);
      return null;
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  // Render children only when the initial user check is complete
  if (currentUser === undefined) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
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