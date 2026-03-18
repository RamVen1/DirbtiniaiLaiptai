import { View, Text, ScrollView } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const data = [
  {
    name: 'completed',
    population: 4,
    color: '#7A1CAC',
    legendFontColor: '#2E073F',
    legendFontSize: 15,
  },
  {
    name: 'not completed',
    population: 2,
    color: '#AD49E1',
    legendFontColor: '#2E073F',
    legendFontSize: 15,
  },
];

// Example data: completed tasks per day
const labels = ['1 Week', '2 Week', '3 Week', '4 Week', '5 Week'];
const dailyCompletedTasks = [7, 5, 3, 4, 0]; // Example data for 5 weeks

// Compute cumulative sum for progress
const cumulativeTasks = dailyCompletedTasks.reduce((acc, val, i) => {
  acc.push((acc[i - 1] || 0) + val);
  return acc;
}, [] as number[]);

export default function MiniReport() {
  return (
    <View className="flex-1 bg-background px-6 pt-16">
      {/* Scrollable content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-5xl text-foreground font-semibold mb-6">Weekly Report</Text>

        {/* STREAK CARD */}
        <View className="items-center border-border bg-card mb-6 rounded-2xl border p-5">
          <Ionicons name="flame-sharp" size={70} color="#7A1CAC" />
          <Text className="text-3xl text-foreground font-bold mt-2">5 Days</Text>
          <Text className="text-foreground/80">Current streak</Text>
        </View>

        {/* PIE CHART CARD */}
        <View className="items-center border-border bg-card mb-6 rounded-2xl border p-5">
          <Text className="text-3xl text-foreground font-bold mt-2">Completed tasks</Text>
          <PieChart
            data={data}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#EBD3F8',
              backgroundGradientTo: '#EBD3F8',
              color: (opacity = 1) => `rgba(46, 7, 63, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft={'100'} // center properly
            hasLegend={false}
          />
        </View>

        {/* Another PIE CHART CARD */}
        <View className="items-center border-border bg-card mb-6 rounded-2xl border p-5">
          <View className="items-center mb-6">
            <Text className="text-3xl text-foreground font-bold mt-2">Progress</Text>
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: cumulativeTasks,
                    color: (opacity = 1) => `rgba(122, 28, 172, ${opacity})`,
                    strokeWidth: 3,
                  },
                ],
              }}
              width={screenWidth - 100}
              height={240}
              fromZero
              yAxisSuffix=""
              withDots={false}
              withHorizontalLabels={false}
              withVerticalLabels={false}
              chartConfig={{
                backgroundGradientFrom: '#EBD3F8',
                backgroundGradientTo: '#EBD3F8',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(173, 73, 225, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(46, 7, 63, ${opacity})`,
                propsForBackgroundLines: {
                  stroke: 'transparent',
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
