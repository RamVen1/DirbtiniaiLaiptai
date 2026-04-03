import { Text, View, TextInput, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import { useJoinGroup } from '@/hooks/use-join-group';

export default function JoinGroupScreen() {
  const { input, setInput, loading, handleJoin } = useJoinGroup();

  return (
    <View className="flex-1 bg-background px-6 pt-16 items-start">
      <Text className="text-3xl text-foreground font-semibold pb-5">Join a group</Text>
      
      <View className="w-full">
        <TextInput
          className="border-border bg-card text-foreground border-2 rounded-md py-3 px-4 w-full font-mono"
          onChangeText={setInput}
          value={input}
          placeholder="Group code e.g. ABC12345"
          placeholderTextColor="#7A1CAC"
          autoCapitalize="characters"
          maxLength={8}
        />
        
        <Button 
          className="mt-3 w-full" 
          onPress={handleJoin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Join</Text>
          )}
        </Button>

        <Button 
          variant="outline" 
          className="mt-2 w-full border-none" 
          onPress={() => router.replace('/(tabs)')}
        >
          <Text className="text-muted-foreground">Cancel</Text>
        </Button>
      </View>
    </View>
  );
}