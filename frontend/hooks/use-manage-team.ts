import { useAuth } from "@/app/_layout";
import { Colors } from "@/constants/theme";
import { useState } from "react";
import { Alert, useColorScheme } from "react-native";
import { getItem } from "@/utils/storage";
import { useEffect } from "react";
import * as Clipboard from 'expo-clipboard';

export function useManageTeam(){
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    const token = await getItem('userToken');
  
    try {
      const response = await fetch(`${API_URL}/moderate/teams`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    
      const data = await response.json();
      if (data.teams) {
        setTeams(data.teams);
      }
    } catch (error) {
      console.error("Fetch teams error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeams(); }, [user]);

  const handleCreateTeam = async () => {
    const token = await getItem('userToken');
    try {
      const response = await fetch(`${API_URL}/moderate/teams/create`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });

      if (response.ok) {
        const newTeam = await response.json();
        Alert.alert("Success", `Created Team #${newTeam.ID}`);
        fetchTeams();
      } else {
        Alert.alert("Error", "Failed to create team.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
  try {
    const token = await getItem('userToken');

    const url = `${API_URL}/moderate/teams/${teamId}`;

    const response = await fetch(url, { 
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      fetchTeams(); 
    } else {
      const errorText = await response.text();
      console.log("KLAIDA IŠ SERVERIO:", errorText);
    }
  } catch (e) {
    console.error("TINKLO KLAIDA:", e);
  }
};

  const copyToClipboard = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert("Copied", "Team code copied to clipboard!");
  };

 return { teams, loading, tint, handleCreateTeam, handleDeleteTeam, copyToClipboard };
}