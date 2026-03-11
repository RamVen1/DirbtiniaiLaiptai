import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

export default function RegisterForm() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="gap-y-4">
      <View>
        <Text className="text-lg mb-2">Name</Text>
        <TextInput 
          className="border-2 border-black rounded-xl p-4 text-lg"
          placeholder="Name"
        />
      </View>

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
          placeholder="password"
          secureTextEntry
        />
      </View>

      <Button className="mt-6 bg-white border-2 border-black h-14 rounded-2xl active:bg-purple-400">
        <Text className="text-black text-xl font-semibold">Create account</Text>
      </Button>
    </ScrollView>
  );
}