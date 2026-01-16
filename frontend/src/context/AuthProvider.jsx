import { useState, useCallback } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || null); // admin, student, teacher, parent
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Universal login function
  const login = useCallback(async (email, password, userRole) => {
    setIsLoading(true);
    setError(null);
    try {
      // Different endpoints based on role
      const endpoint = {
        admin: 'http://localhost:5000/adminLogin',
        student: 'http://localhost:5000/studentLogin'
      }[userRole];

      const response = await axios.post(endpoint,{email,password});

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', userRole);
        setToken(response.data.token);
        setRole(userRole);
        return true;
      }
      setError(response.data.message || 'Login failed');
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  }, []);

// Fetch user profile
//   const fetchUserProfile = useCallback(async () => {
//     if (!token || !role) return;
//     setIsLoading(true);
//     try {
//       const response = await fetch(`http://your-api/${role}/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       setUser(data.user);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [token, role]);

  const value = {
    user,
    role,
    token,
    isLoading,
    error,
    login,
    logout,
    token,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;