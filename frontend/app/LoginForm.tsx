import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
export default function LoginForm() {
  return (
    /* Išcentruojame konteinerį ir apribojame plotį iki 350px, kad nebūtų ištempta */
    <View className="gap-y-6 w-full max-w-[350px] self-center">
      
      <View>
        <Text className="text-lg mb-2 text-white font-medium">Email</Text>
        <TextInput 
          className="border-2 border-white rounded-2xl p-4 text-lg text-white"
          placeholder="example@mail.com"
          placeholderTextColor="#9ca3af" // Pilkšva spalva, kad matytųsi ant tamsaus fono
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View>
        <Text className="text-lg mb-2 text-white font-medium">Password</Text>
        <TextInput 
          className="border-2 border-white rounded-2xl p-4 text-lg text-white"
          placeholder="********"
          placeholderTextColor="#9ca3af"
          secureTextEntry
        />
      </View>

      {/* Mygtukas dabar bus baltas su juodu tekstu, kad kontrastuotų su juodu fonu */}
      <Button className="mt-4 bg-white h-14 rounded-2xl active:bg-purple-400" onPress={() => router.replace('/(tabs)')}>
        <Text className="text-black text-xl font-bold">Log in</Text>
      </Button>
       <Button className="mt-4 bg-white h-14 rounded-2xl active:bg-purple-400" onPress={() => router.push('/RegisterForm')}>
        <Text className="text-black text-xl font-bold">Register</Text>
      </Button>
    </View>
  );
}