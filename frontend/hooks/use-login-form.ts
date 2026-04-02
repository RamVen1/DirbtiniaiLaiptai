import { useAuth } from '@/hooks/use-auth';
import { useState } from "react";
import { saveItem } from "@/utils/storage";

export function useLoginForm(){
  const { setHasToken, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Login failed');
        return;
      }

      if (!data.token) {
        setError('No token received from server.');
        return;
      }

      await saveItem('userToken', data.token);
      if (data.user) {
        const cleanUser = {
        id: data.user.id,
        username: data.user.username,
        role: data.user.Role || data.user.role,
        team_id: data.user.team_id
      };

      await saveItem('userData', JSON.stringify(cleanUser));
      setUser(cleanUser);
      }

      setHasToken(true);

    } catch (err) {
      console.error('Login error:', err);
      setError(`Could not connect to server. ${err instanceof Error ? err.message : ''}`);
    } finally {
      setLoading(false);
    }
  };
  return { email, setEmail, password, setPassword, loading, error, handleLogin };
}