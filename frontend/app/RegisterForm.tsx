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
      const response = await fetch('http://localhost:8000/auth/register', {
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
      className="w-full bg-background px-6 pt-16"
    >
      <View className="gap-y-5 w-full max-w-[350px]">
        <Text className="text-4xl text-foreground font-bold mb-2">Create account</Text>
        <View>
          <Text className="text-lg mb-2 text-foreground font-medium">Name</Text>
          <TextInput
            className="border-2 border-border bg-card rounded-2xl p-4 text-lg text-foreground"
            placeholder="Your Name"
            placeholderTextColor="#7A1CAC"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-lg mb-2 text-foreground font-medium">Email</Text>
          <TextInput
            className="border-2 border-border bg-card rounded-2xl p-4 text-lg text-foreground"
            placeholder="example@mail.com"
            placeholderTextColor="#7A1CAC"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text className="text-lg mb-2 text-foreground font-medium">Password</Text>
          <TextInput
            className="border-2 border-border bg-card rounded-2xl p-4 text-lg text-foreground"
            placeholder="Create password"
            placeholderTextColor="#7A1CAC"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Display Error Message */}
        {error && <Text className="text-foreground text-center font-medium mt-2">{error}</Text>}

        <Button
          className={`mt-4 h-14 rounded-2xl ${loading ? 'opacity-70' : ''}`}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#EBD3F8" />
          ) : (
            <Text className="text-xl font-bold">Create account</Text>
          )}
        </Button>
      </View>
    </ScrollView>
  );
}
