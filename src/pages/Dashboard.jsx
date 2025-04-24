import React, { useState } from 'react';
import { BarChart3, Users, Crown, UserCheck, UserX, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import Chart from 'react-apexcharts';

const summaryCards = [
  { title: 'Total Users', value: '24,850', icon: Users, change: '+12%', color: 'blue' },
  { title: 'Premium Users', value: '3,650', icon: Crown, change: '+8%', color: 'yellow' },
  { title: 'Active Users', value: '18,200', icon: UserCheck, change: '+15%', color: 'green' },
  { title: 'Banned Users', value: '245', icon: UserX, change: '-2%', color: 'red' },
  { title: 'Reported Users', value: '182', icon: AlertTriangle, change: '-5%', color: 'orange' },
  { title: 'Total Payments', value: '$128,250', icon: CreditCard, change: '+18%', color: 'purple' },
  { title: 'Monthly Revenue', value: '$32,800', icon: TrendingUp, change: '+22%', color: 'indigo' },
  { title: 'Active Chats', value: '1,250', icon: BarChart3, change: '+10%', color: 'cyan' },
];

const recentActivity = [
  { id: 1, action: 'New user registration', user: 'Sarah Parker', time: '2 minutes ago' },
  { id: 2, action: 'Premium subscription purchased', user: 'John Smith', time: '15 minutes ago' },
  { id: 3, action: 'Profile reported', user: 'Mike Johnson', time: '1 hour ago' },
  { id: 4, action: 'Chat message flagged', user: 'Emily Brown', time: '2 hours ago' },
  { id: 5, action: 'Account verified', user: 'David Wilson', time: '3 hours ago' },
];

const timeRanges = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year'];

export function Dashboard() {
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]);
  const [userGrowthData, setUserGrowthData] = useState({
    options: {
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
    },
    series: [
      {
        name: 'New Users',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  });

  const [revenueData, setRevenueData] = useState({
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$ ' + val + ' thousands';
          },
        },
      },
    },
    series: [
      {
        name: 'Revenue',
        data: [44, 55, 57, 56, 61, 58, 63],
      },
    ],
  });

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    // In a real app, you would fetch new data based on the selected range
    // For demo, we'll just simulate data changes
    const newUserData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 20);
    const newRevenueData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 40);

    setUserGrowthData(prev => ({
      ...prev,
      series: [{ ...prev.series[0], data: newUserData }],
    }));

    setRevenueData(prev => ({
      ...prev,
      series: [{ ...prev.series[0], data: newRevenueData }],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <select
            className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            value={selectedRange}
            onChange={(e) => handleRangeChange(e.target.value)}
          >
            {timeRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                <h3 className="text-2xl font-semibold">{card.value}</h3>
              </div>
              <card.icon className={`h-8 w-8 text-${card.color}-500 transition-transform group-hover:scale-110`} />
            </div>
            <p className={`mt-2 text-sm ${card.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {card.change} from last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold">User Growth</h2>
          <Chart
            options={userGrowthData.options}
            series={userGrowthData.series}
            type="area"
            height={350}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold">Revenue</h2>
          <Chart
            options={revenueData.options}
            series={revenueData.series}
            type="bar"
            height={350}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">by {activity.user}</p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}