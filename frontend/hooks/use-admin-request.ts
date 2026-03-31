import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getItem } from '@/utils/storage';


export function useAdminRequest() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const token = await getItem('userToken');
    try {
      const response = await fetch(`${API_URL}/admin/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: number, action: 'Accept' | 'Decline') => {
    const token = await getItem('userToken');
    try {
      const response = await fetch(`${API_URL}/admin/requests/${id}/action`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });
      if (response.ok) {
        setRequests(prev => prev.filter(r => r.ID !== id));
      }
    } catch (e) {
      Alert.alert("Error", "Action failed");
    }
  };

  return { requests, loading, handleAction };
}
