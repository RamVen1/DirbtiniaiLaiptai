import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  return (
    <View className="gap-y-4">
      <View>
        <Text className="text-lg mb-2">Email</Text>
        <TextInput 
          className="border-2 border-black rounded-xl p-4 text-lg"
          placeholder="example@mail.com"
          keyboardType="email-address"
        />
      </View>
      
      <View>
        <Text className="text-lg mb-2">Password</Text>
        <TextInput 
          className="border-2 border-black rounded-xl p-4 text-lg"
          placeholder="********"
          secureTextEntry
        />
      </View>

      <Button className="mt-6 bg-black h-14 rounded-2xl active:bg-purple-900">
        <Text className="text-white text-xl font-semibold">Log in</Text>
      </Button>
    </View>
  );
}