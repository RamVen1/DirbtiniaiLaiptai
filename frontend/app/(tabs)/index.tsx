import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { router } from 'expo-router';
export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <Text className="text-5xl text-foreground font-bold mb-8">Home</Text>
      <View className="border-border bg-card mb-6 rounded-2xl border p-5">
        <Text className="mb-2 text-foreground">Weekly progress</Text>
        <Progress value={0}className="mb-2 h-3" />
        <Text className="text-foreground">33% completed</Text>
      </View>

      <Button
        className="mt-4 h-14 rounded-2xl  text-foreground"
        onPress={() => router.navigate('/MiniReport')}
      >
        <Text className="text-xl font-bold">View weekly report</Text>
      </Button>
    </View>
  );
}
