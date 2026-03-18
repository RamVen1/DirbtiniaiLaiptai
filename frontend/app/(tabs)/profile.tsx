import { View, Text, FlatList } from 'react-native';
import { Button } from '@/components/ui/button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <View className="flex-row items-center rounded-2xl">
        <Ionicons name="person-circle" className="mr-14" size={150} color="#7A1CAC" />
        <View className="ml-4 items-stretch">
          <Text className="text-5xl text-foreground font-normal">Name</Text>
          <Button className="mt-3 border-2" variant="outline">
            <Text className="text-foreground">Edit</Text>
          </Button>
        </View>
      </View>
      <View className="mt-4">
        <Text className="text-6xl text-foreground font-semibold mb-5">History</Text>
        <FlatList
          scrollEnabled={false}
          data={[
            { key: 'Improvement plan Q1' },
            { key: 'Improvement plan Q2' },
            { key: 'Improvement plan Q3' },
            { key: 'Improvement plan Q4' },
          ]}
          renderItem={({ item }) => (
            <Text className="text-base text-foreground font-thin mb-1">{'•' + item.key}</Text>
          )}
        />
      </View>
      <Button className="mt-4 h-14 rounded-2xl" onPress={() => router.push('/LoginForm')}>
        <Text className="text-xl font-bold">Log out</Text>
      </Button>
    </View>
  );
}
