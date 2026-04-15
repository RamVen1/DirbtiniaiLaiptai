import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { GroupedReportHistory } from '@/components/dashboard/grouped-report-history';
import { useReportHistory } from '@/hooks/use-report-history';
import { useProfile } from '@/hooks/use-profile';

export default function ReportHistoryScreen() {
    const router = useRouter();
    const { groupedHistory, loading, error, getSortedSkills, getSkillStats } = useReportHistory();
    const { tint, isTablet } = useProfile();

    const handleReportPress = (report: any) => {
        router.push({
            pathname: '/MiniReport',
            params: { reportId: report.id }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-6 py-4 border-b border-border/20 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                    <Pressable
                        onPress={() => router.back()}
                        className="p-2 rounded-full active:scale-95"
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="chevron-back" size={24} color={tint} />
                    </Pressable>
                    <Text className="text-lg font-black text-foreground tracking-tighter">
                        Learning History
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View className="flex-1">
                <GroupedReportHistory
                    groupedHistory={groupedHistory}
                    loading={loading}
                    error={error}
                    getSortedSkills={getSortedSkills}
                    getSkillStats={getSkillStats}
                    onReportPress={handleReportPress}
                    tint={tint}
                    isTablet={isTablet}
                />
            </View>
        </SafeAreaView>
    );
}
