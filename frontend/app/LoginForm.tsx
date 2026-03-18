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
      setError('Please fill in all fields.');
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
        setError(data.detail || 'Login failed');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <View className="gap-y-6 w-full max-w-[350px] self-center">
        <Text className="text-4xl text-foreground font-bold mb-2">Log in</Text>
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
            placeholder="********"
            placeholderTextColor="#7A1CAC"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && <Text className="text-foreground text-center font-semibold">{error}</Text>}

        <Button className="mt-4 h-14 rounded-2xl" onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#EBD3F8" />
          ) : (
            <Text className="text-xl font-bold">Log in</Text>
          )}
        </Button>

        <Button
          className="mt-2 h-14 rounded-2xl border-2"
          variant="outline"
          onPress={() => router.push('/RegisterForm')}
        >
          <Text className="text-xl font-bold text-foreground">Register</Text>
        </Button>
      </View>
    </View>
  );
}
