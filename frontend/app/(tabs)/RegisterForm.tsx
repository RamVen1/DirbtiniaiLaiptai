import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

export default function RegisterForm() {
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      // Išcentruojame turinį ir apribojame plotį, kad nebūtų per visą ekraną
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
          />
        </View>
        
        <View>
          <Text className="text-lg mb-2 text-white font-medium">Password</Text>
          <TextInput 
            className="border-2 border-white rounded-2xl p-4 text-lg text-white"
            placeholder="Create password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
          />
        </View>

        {/* Kontrastingas mygtukas: Baltas fonas, juodas tekstas */}
        <Button className="mt-4 bg-white h-14 rounded-2xl active:bg-purple-400 border-none">
          <Text className="text-black text-xl font-bold">Create account</Text>
        </Button>

      </View>
    </ScrollView>
  );
}