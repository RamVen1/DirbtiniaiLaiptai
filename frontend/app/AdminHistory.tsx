import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Pressable,
  ActivityIndicator,
  Animated,
  useWindowDimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text } from '@/components/ui/text';
import { useThemePalette } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';
import { useEntranceAnimation } from '@/hooks/use-entrance-animation';
import { getItem } from '@/utils/storage';

type AdminHistoryRequest = {
  ID: number;
  Status: string;
  RequestDate: string;
  ProcessedDate: string;
  UserEmail: string;
  UserUsername?: string | null;
  AdminEmail?: string | null;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function AdminHistoryScreen() {
  const router = useRouter();
  const { tint } = useThemePalette();
  const { user } = useAuth();
  const { opacity: contentOpacity, translateY: contentTranslateY } = useEntranceAnimation();
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 34 : 20;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [newestFirst, setNewestFirst] = useState(true);
  const [requests, setRequests] = useState<AdminHistoryRequest[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getItem('userToken');
        const response = await fetch(`${API_URL}/admin/requests/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setError('Failed to load admin history.');
          setRequests([]);
          return;
        }

        const data = await response.json();
        setRequests((data?.requests || []) as AdminHistoryRequest[]);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Error loading admin history.');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role?.toLowerCase() === 'admin') {
      fetchHistory();
    } else {
      setLoading(false);
      setError('This page is available to admins only.');
    }
  }, [user?.role]);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...requests]
      .filter((request) => {
        if (!query) return true;

        const username = (request.UserUsername || '').toLowerCase();
        const email = (request.UserEmail || '').toLowerCase();
        const adminEmail = (request.AdminEmail || '').toLowerCase();

        return username.includes(query) || email.includes(query) || adminEmail.includes(query);
      })
      .sort((requestA, requestB) => {
        const dateA = new Date(requestA.ProcessedDate || requestA.RequestDate).getTime();
        const dateB = new Date(requestB.ProcessedDate || requestB.RequestDate).getTime();
        return newestFirst ? dateB - dateA : dateA - dateB;
      });
  }, [requests, search, newestFirst]);

  if (!user || user.role?.toLowerCase() !== 'admin' || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 active:scale-95"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color={tint} />
            </Pressable>

            <Text className="text-lg font-black text-primary tracking-tighter">Admin History</Text>

            <View className="w-8" />
          </View>
        </View>

        <Animated.ScrollView
          className="flex-1 bg-background"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 108,
            paddingHorizontal: horizontalPadding,
            paddingBottom: 140,
          }}
          style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}
        >
          <View className="w-full">

            <View className="flex-row items-center gap-3 mb-6">
              <View className="flex-1 flex-row items-center gap-3 rounded-2xl border border-border/20 bg-card px-4 py-3">
                <Ionicons name="search-outline" size={18} color={tint} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search name or email"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-foreground"
                />
              </View>

              <Pressable
                onPress={() => setNewestFirst((current) => !current)}
                className="h-12 px-4 rounded-2xl border border-border/20 bg-card flex-row items-center gap-2 active:opacity-80"
              >
                <Ionicons
                  name={newestFirst ? 'arrow-down-outline' : 'arrow-up-outline'}
                  size={18}
                  color={tint}
                />
                <Text className="text-foreground font-bold text-sm">
                  {newestFirst ? 'Newest' : 'Oldest'}
                </Text>
              </Pressable>
            </View>

            {error ? (
              <View className="bg-card rounded-3xl p-8 items-center justify-center border border-border/20">
                <Ionicons name="alert-circle-outline" size={34} color={tint} />
                <Text className="text-xl font-bold text-foreground mt-4 mb-2">Unable to load history</Text>
                <Text className="text-center text-foreground/70">{error}</Text>
              </View>
            ) : filteredRequests.length === 0 ? (
              <View className="bg-card rounded-3xl p-8 items-center justify-center border border-border/20">
                <Text className="text-xl font-bold text-foreground mb-2">No history found</Text>
                <Text className="text-center text-foreground/70">
                  {search ? 'Try a different search term.' : 'There are no handled requests yet.'}
                </Text>
              </View>
            ) : (
              <View className="flex-col gap-3">
                {filteredRequests.map((request) => {
                  const submittedDate = new Date(request.RequestDate).toLocaleDateString();
                  const processedDate = new Date(request.ProcessedDate).toLocaleDateString();
                  const displayName = request.UserUsername || request.UserEmail;

                  return (
                    <View key={request.ID} className="rounded-2xl border border-border/20 bg-card p-4 shadow-sm">
                      <View className="mb-3 flex-row items-start justify-between gap-4">
                        <View className="flex-1">
                          <Text className="text-sm font-bold text-foreground">{displayName}</Text>
                          <Text className="text-xs text-foreground/60 mt-1">Submitted: {submittedDate}</Text>
                          <Text className="text-xs text-foreground/60 mt-1">Processed: {processedDate}</Text>
                        </View>

                        <View className="rounded-full bg-primary/10 px-3 py-1">
                          <Text className="text-primary text-xs font-bold uppercase">{request.Status}</Text>
                        </View>
                      </View>

                      <View className="h-px bg-border/20 mb-3" />

                      <View className="flex-row items-center justify-between gap-3">
                        <View>
                          <Text className="text-[11px] uppercase tracking-widest text-foreground/50">
                            EMAIL
                          </Text>
                          <Text className="text-sm text-foreground font-semibold">
                            {request.UserEmail}
                          </Text>
                        </View>

                       
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}