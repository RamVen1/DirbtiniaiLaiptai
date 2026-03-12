import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 7) {
      setError('Password must be at least 7 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/register', {
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

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: 'center' }}
      className="w-full"
    >
      <View className="gap-y-5 w-full max-w-[350px]">
        
        <View>
          <Text className="text-lg mb-2 text-white font-medium">Name</Text>
          <TextInput 
            className="border-2 border-white rounded-2xl p-4 text-lg text-white"
            placeholder="Your Name"
            placeholderTextColor="#9ca3af"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

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
            placeholder="Create password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Display Error Message */}
        {error && (
          <Text className="text-red-400 text-center font-medium mt-2">
            {error}
          </Text>
        )}

        <Button 
          className={`mt-4 bg-white h-14 rounded-2xl border-none ${loading ? 'opacity-70' : 'active:bg-purple-400'}`} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="text-black text-xl font-bold">Create account</Text>
          )}
        </Button>
      </View>
    </ScrollView>
  );
}