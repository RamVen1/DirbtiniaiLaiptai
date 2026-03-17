import { View, Text, FlatList } from 'react-native';
import { Button } from '@/components/ui/button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-white px-6 pt-16 ">
      <View className="flex-row items-center rounded-2xl">
        <Ionicons name="person-circle" className="mr-14" size={150} color="black" />
        <View className="ml-4 items-stretch">
          <Text className="text-5xl text-black font-normal">Name</Text>
          <Button className="mt-3 bg-white border-black border-2 hover:bg-purple-400  active:bg-purple-900">
            <Text>Edit</Text>
          </Button>
        </View>
      </View>
      <View className="mt-4">
        <Text className="text-6xl font-semibold mb-5">History</Text>
        <FlatList
          scrollEnabled={false}
          data={[
            { key: 'Improvement plan Q1' },
            { key: 'Improvement plan Q2' },
            { key: 'Improvement plan Q3' },
            { key: 'Improvement plan Q4' },
          ]}
          renderItem={({ item }) => (
            <Text className="text-base font-thin mb-1">{'•' + item.key}</Text>
          )}
        />
      </View>
      <Button
        className="mt-4 bg-black h-14 rounded-2xl active:bg-purple-400"
        onPress={() => router.push('/LoginForm')}
      >
        <Text className="text-white text-xl font-bold">Log out</Text>
      </Button>
    </View>
  );
}
