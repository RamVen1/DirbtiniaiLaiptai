import React from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { useRegisterForm } from '@/hooks/use-register-form';

export default function RegisterForm() {

  const {
     username,
     setUsername,
     email,
     setEmail,
     password,
     setPassword,
     error,
     loading,
     handleRegister,
  } = useRegisterForm();

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
