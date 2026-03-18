import { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

export default function JoinGroupScreen() {
  const [input, setInput] = useState('');
  return (
    <View className="flex-1 bg-background px-6 pt-16 items-start">
      <Text className="text-3xl text-foreground font-semibold pb-5">Join a group</Text>
      <View className="flex-1 w-full">
        <TextInput
          className="border-border bg-card text-foreground border-2 rounded-md py-3 px-4 w-full"
          onChangeText={setInput}
          value={input}
          placeholder="Group code e.g. 3XHG8"
          placeholderTextColor="#7A1CAC"
          maxLength={5}
        />
        <Button className="mt-3" onPress={() => router.replace('/profile')}>
          <Text className="font-semibold">Join</Text>
        </Button>
      </View>
    </View>
  );
}
