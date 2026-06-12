import { createContext, useContext, useEffect, useState } from 'react';
import {
  subscribeToAuth,
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        setUser(firebaseUser);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const firebaseUser = await loginUser(email, password);
    const userProfile = await getUserProfile(firebaseUser.uid);
    setProfile(userProfile);
    return firebaseUser;
  };

  const register = async (email, password, nombre) => {
    const firebaseUser = await registerUser(email, password, nombre);
    const userProfile = await getUserProfile(firebaseUser.uid);
    setProfile(userProfile);
    return firebaseUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
}
