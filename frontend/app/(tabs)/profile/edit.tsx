import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';


export default function EditProfileScreen() {
  const [showAvatarPanel, setShowAvatarPanel] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const avatars = [
    require('@/assets/images/avatars/avatar1.jpg'),
    require('@/assets/images/avatars/avatar2.jpg'),
    require('@/assets/images/avatars/avatar3.jpg')
  ];
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;
  const text = Colors[colorScheme === 'dark' ? 'dark' : 'light'].text;

  const [name, setName] = useState('Name Surname');
  const [role, setRole] = useState('Senior Cloud Architect');
  const [email, setEmail] = useState('engineer@logic.io');



  const defaultAvatar = require('@/assets/images/avatars/avatar1.jpg');
  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={tint} />
          </Pressable>

          <Text className="text-lg font-bold tracking-tight">
            Edit Profile
          </Text>

          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View className="items-center mt-6 mb-10">
            <View className="w-32 h-32 rounded-full bg-primary/20 items-center justify-center overflow-hidden">

              <Image
                source={
                  selectedAvatar !== null
                    ? avatars[selectedAvatar]
                    : defaultAvatar
                }
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 999, // 🔑 important for web
                }}
                resizeMode="cover"
              />


            </View>

            <Pressable
              className="mt-4 px-4 py-2 bg-surfaceContainer rounded-xl"
              onPress={() => setShowAvatarPanel(true)}
            >
              <Text className="text-primary text-base font-semibold" >
                Change Avatar
              </Text>
            </Pressable>
          </View>
          {/* Form Fields */}
          <View className="gap-6">

            {/* Name */}
            <View>
              <Text className="text-s mb-2 text-primary tracking-wide font-semibold">
                FULL NAME
              </Text>

              <View className="bg-surfaceContainerLow rounded-xl px-4 py-3">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={tint}
                  style={{ color: tint }}
                />
              </View>
            </View>

            {/* Role */}
            <View>
              <Text className="text-s mb-2 text-primary tracking-wide font-semibold">
                ROLE
              </Text>

              <View className="bg-surfaceContainerLow rounded-xl px-4 py-3">
                <TextInput
                  value={role}
                  onChangeText={setRole}
                  placeholder="Your role"
                  placeholderTextColor={tint}
                  style={{ color: tint }}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-s mb-2 text-primary tracking-wide font-semibold">
                EMAIL
              </Text>

              <View className="bg-surfaceContainerLow rounded-xl px-4 py-3">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="engineer@logic.io"
                  placeholderTextColor={tint}
                  style={{ color: tint }}
                />
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="mt-10 gap-4">
            <Button
              className="rounded-xl"
              onPress={() => router.replace('/profile')}
            >
              <Text className="text-white font-bold text-base">
                Save Changes
              </Text>
            </Button>

            <Button variant="secondary" className="flex-1 rounded-xl" onPress={() => { router.navigate('/profile/modal') }}>
              <Text className="text-primary font-bold text-base">Cancel</Text>
            </Button>
          </View>
        </ScrollView>
        {showAvatarPanel && (
          <View className="absolute inset-0 justify-end bg-black/40">

            {/* Close on background click */}
            <Pressable
              className="absolute inset-0"
              onPress={() => setShowAvatarPanel(false)}
            />

            {/* Bottom Sheet */}
            <View className="bg-surfaceContainer rounded-t-3xl p-6">

              <Text className="text-lg font-bold mb-6 text-center">
                Choose Avatar
              </Text>

              <View className="flex-row flex-wrap justify-center gap-4">
                {avatars.map((avatar, index) => {
                  const isSelected = selectedAvatar === index;

                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setSelectedAvatar(index);
                        setShowAvatarPanel(false);
                      }}
                      className="items-center justify-center"
                    >
                      {/* Outer circle (border) */}
                      <View
                        className={`w-20 h-20 rounded-full items-center justify-center ${isSelected ? 'border-2 border-primary' : ''
                          }`}
                      >
                        {/* Inner circle (image container) */}
                        <View className="w-full h-full rounded-full overflow-hidden">
                          <Image
                            source={avatar}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 999, // 🔑 important for web
                            }}
                            resizeMode="cover"
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                onPress={() => setShowAvatarPanel(false)}
                className="mt-6 items-center"
              >
              </Pressable>

            </View>
          </View>
        )}
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}