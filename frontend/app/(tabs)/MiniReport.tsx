import { View, Text, ScrollView } from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;
const data = [
    { name: "completed", population: 4, color: "#67f364", legendFontColor: "#333", legendFontSize: 15 },
    { name: "not completed", population: 2, color: "#e16f6f", legendFontColor: "#333", legendFontSize: 15 },
];

// Example data: completed tasks per day
const labels = ["1 Week", "2 Week", "3 Week", "4 Week", "5 Week"];
const dailyCompletedTasks = [7, 5, 3, 4, 0]; // Example data for 5 weeks

// Compute cumulative sum for progress
const cumulativeTasks = dailyCompletedTasks.reduce((acc, val, i) => {
    acc.push((acc[i - 1] || 0) + val);
    return acc;
}, [] as number[]);

export default function MiniReport() {
    return (
        <View className="flex-1 bg-white px-6 pt-16">
            {/* Scrollable content */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-5xl font-semibold mb-6">Weekly Report</Text>

                {/* STREAK CARD */}
                <View className="items-center bg-orange-100 rounded-3xl p-6 mb-6">
                    <Ionicons name="flame-sharp" size={70} color="orange" />
                    <Text className="text-4xl font-bold mt-2">5 Days</Text>
                    <Text className="text-gray-600">Current streak</Text>
                </View>

                {/* PIE CHART CARD */}
                <View className="items-center bg-orange-100 rounded-3xl p-6 mb-6">
                    <Text className="text-lg font-semibold mb-2">Completed tasks</Text>
                    <PieChart
                        data={data}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft={"100"} // center properly
                        hasLegend={false}
                    />

                </View>

                {/* Another PIE CHART CARD */}
                <View className="items-center bg-orange-100 rounded-3xl p-6 mb-6">
                    <View className="items-center mb-6">
                        <Text className="text-lg font-semibold mb-2">Progress</Text>
                        <LineChart
                            data={{
                                labels: labels,
                                datasets: [
                                    {
                                        data: cumulativeTasks,
                                        color: (opacity = 1) => `rgba(16, 185, 67, ${opacity})`, // green line
                                        strokeWidth: 3,
                                    },
                                ],
                            }}
                            width={screenWidth - 100} 
                            height={240} 
                            fromZero
                            yAxisSuffix=""
                            chartConfig={{
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(100,100,100,${opacity})`,
                                propsForBackgroundLines: {
                                    stroke: "transparent", 
                                },
                            }}
                            style={{
                                borderRadius: 16,
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}