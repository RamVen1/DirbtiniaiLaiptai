import { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

export default function JoinGroupScreen() {
  const [input, setInput] = useState('');
  return (
    <View className="flex-1 bg-white px-6 pt-16 items-start">
      <Text className="text-3xl text-black font-semibold pb-5">Joing a group</Text>
      <View className="flex-1 w-full">
        <TextInput
          className="border-black border-2 rounded-sm py-2 px-3 w-full"
          onChangeText={setInput}
          value={input}
          placeholder="Group code e.g. 3XHG8"
          maxLength={5}
        />
        <Button className="mt-3 bg-white border-black border-2 hover:bg-purple-400  active:bg-purple-900"
        onPress={() => router.push('/LoginForm')}>
          <Text>Join</Text>
        </Button>
      </View>
    </View>
  );
}
