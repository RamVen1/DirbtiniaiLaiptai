import { router } from "expo-router";
import { useState } from "react";


export function useRegisterForm() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 7) {
      setError('Password must be at least 7 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Registration failed.');
      } else {
        router.push('/LoginForm');
      }
    } catch (err) {
      setError('Network error. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  return { 
    username,
    setUsername,
    email,
    setEmail,
    password, 
    setPassword,
    error,
    loading, 
    handleRegister
   };
}

