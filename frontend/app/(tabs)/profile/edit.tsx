import React from 'react';
import { View, ScrollView, Pressable, TextInput, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useEditProfile } from '@/hooks/use-edit-profile';

export default function EditProfileScreen() {
  const { 
    name, 
    setName, 
    role, 
    email, 
    setEmail, 
    loading,
    handleSave,
    defaultAvatar,
    showAvatarPanel, 
    setShowAvatarPanel,
    selectedAvatar,
    setSelectedAvatar,
    tint,
    avatars
  } = useEditProfile();

  const onSave = async () => {
    await handleSave();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-border/10">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={22} color={tint} />
          </Pressable>

          <Text className="text-lg font-bold tracking-tight">
            Edit Profile
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View className="items-center mt-6 mb-10">
            <View className="w-32 h-32 rounded-full bg-primary/20 items-center justify-center overflow-hidden border-4 border-background shadow-sm">
              <Image
                source={
                  selectedAvatar !== null
                    ? avatars[selectedAvatar]
                    : defaultAvatar
                }
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 999,
                }}
                resizeMode="cover"
              />
            </View>

            <Pressable
              className="mt-4 px-4 py-2 bg-muted rounded-xl"
              onPress={() => setShowAvatarPanel(true)}
            >
              <Text className="text-primary text-base font-semibold">
                Change Avatar
              </Text>
            </Pressable>
          </View>

          {/* Form Fields */}
          <View className="gap-6">
            {/* Username / Name */}
            <View>
              <Text className="text-xs mb-2 text-primary tracking-widest font-bold uppercase">
                Username
              </Text>
              <View className="bg-card border border-border/50 rounded-xl px-4 py-3">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your username"
                  placeholderTextColor="#888"
                  style={{ color: tint, fontSize: 16 }}
                />
              </View>
            </View>

            {/* Role - Read Only */}
            <View>
              <Text className="text-xs mb-2 text-muted-foreground tracking-widest font-bold uppercase">
                Role (Managed by Admin)
              </Text>
              <View className="bg-muted/50 rounded-xl px-4 py-3 border border-border/20">
                <TextInput
                  value={role}
                  editable={false}
                  style={{ color: '#888', fontSize: 16 }}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-xs mb-2 text-primary tracking-widest font-bold uppercase">
                Email Address
              </Text>
              <View className="bg-card border border-border/50 rounded-xl px-4 py-3">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="email@example.com"
                  placeholderTextColor="#888"
                  style={{ color: tint, fontSize: 16 }}
                />
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="mt-10 gap-4">
            <Button
              className="rounded-xl h-14"
              onPress={onSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Save Changes</Text>
              )}
            </Button>

            <Button 
              variant="outline" 
              className="rounded-xl h-14 border-border" 
              onPress={() => router.back()}
            >
              <Text className="text-foreground font-bold text-base">Cancel</Text>
            </Button>
          </View>
        </ScrollView>

        {/* Avatar Panel Overlay */}
        {showAvatarPanel && (
          <View className="absolute inset-0 justify-end bg-black/50">
            <Pressable className="absolute inset-0" onPress={() => setShowAvatarPanel(false)} />
            <View className="bg-card rounded-t-3xl p-6">
              <Text className="text-lg font-bold mb-6 text-center">Choose Avatar</Text>
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
                      className={`w-20 h-20 rounded-full overflow-hidden border-2 ${isSelected ? 'border-primary' : 'border-transparent'}`}
                    >
                      <Image source={avatar} style={{ width: '100%', height: '100%' }} />
                    </Pressable>
                  );
                })}
              </View>
              <Button className="mt-6 rounded-xl" onPress={() => setShowAvatarPanel(false)}>
                <Text className="text-white">Cancel</Text>
              </Button>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}