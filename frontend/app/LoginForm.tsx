import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed");
      } else {
        router.replace('/(tabs)'); 
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Išcentruojame konteinerį ir apribojame plotį iki 350px, kad nebūtų ištempta */
    <View className="gap-y-6 w-full max-w-[350px] self-center">
      
      <View>
        <Text className="text-lg mb-2 text-white font-medium">Email</Text>
        <TextInput 
          className="border-2 border-white rounded-2xl p-4 text-lg text-white"
          placeholder="example@mail.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      
      <View>
        <Text className="text-lg mb-2 text-white font-medium">Password</Text>
        <TextInput 
          className="border-2 border-white rounded-2xl p-4 text-lg text-white"
          placeholder="********"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error && <Text className="text-red-400 text-center font-bold">{error}</Text>}

      <Button 
        className="mt-4 bg-white h-14 rounded-2xl active:bg-purple-400" 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-black text-xl font-bold">Log in</Text>
        )}
      </Button>

      <Button 
        className="mt-2 bg-transparent h-14 rounded-2xl border-2 border-white" 
        onPress={() => router.push('/RegisterForm')}
      >
        <Text className="text-white text-xl font-bold">Register</Text>
      </Button>
    </View>
  );
}