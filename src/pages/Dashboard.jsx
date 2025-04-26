import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Crown, UserCheck, UserX, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import Chart from 'react-apexcharts';
import { toast } from 'react-hot-toast';
import * as dashboardService from '../services/dashboard';

const timeRanges = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year'];

export function Dashboard() {
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    reportedUsers: 0,
    totalPayments: 0,
    monthlyRevenue: 0,
    activeChats: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        categories: [],
        type: 'datetime',
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy',
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
        data: [],
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
        categories: [],
        type: 'datetime',
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
        data: [],
      },
    ],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [selectedRange]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, activitiesResponse] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivities()
      ]);

      if (statsResponse.status && statsResponse.data) {
        setStats(statsResponse.data);
      }

      if (activitiesResponse.status && activitiesResponse.data) {
        setRecentActivity(activitiesResponse.data);
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const [userGrowthResponse, revenueResponse] = await Promise.all([
        dashboardService.getUserGrowthChart(selectedRange),
        dashboardService.getRevenueChart(selectedRange)
      ]);

      if (userGrowthResponse.status === 'success' && userGrowthResponse.data) {
        setUserGrowthData(prev => ({
          ...prev,
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: userGrowthResponse.data.labels
            }
          },
          series: [{
            name: 'New Users',
            data: userGrowthResponse.data.user_growth
          }]
        }));
      }

      if (revenueResponse.status === 'success' && revenueResponse.data) {
        setRevenueData(prev => ({
          ...prev,
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: revenueResponse.data.labels
            }
          },
          series: [{
            name: 'Revenue',
            data: revenueResponse.data.revenue
          }]
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch chart data');
    }
  };

  const summaryCards = [
    { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, change: '+12%', color: 'blue' },
    { title: 'Premium Users', value: stats.premiumUsers.toLocaleString(), icon: Crown, change: '+8%', color: 'yellow' },
    { title: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: UserCheck, change: '+15%', color: 'green' },
    { title: 'Banned Users', value: stats.bannedUsers.toLocaleString(), icon: UserX, change: '-2%', color: 'red' },
    { title: 'Reported Users', value: stats.reportedUsers.toLocaleString(), icon: AlertTriangle, change: '-5%', color: 'orange' },
    { title: 'Total Payments', value: `$${stats.totalPayments.toLocaleString()}`, icon: CreditCard, change: '+18%', color: 'purple' },
    { title: 'Monthly Revenue', value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: TrendingUp, change: '+22%', color: 'indigo' },
    { title: 'Active Chats', value: stats.activeChats.toLocaleString(), icon: BarChart3, change: '+10%', color: 'cyan' },
  ];

  const renderStatsSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <div
          key={index}
          className="group animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="mt-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ))}
    </div>
  );

  const renderChartsSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-[350px] animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-[350px] animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );

  const renderActivitiesSkeleton = () => (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 h-6 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="flex animate-pulse items-center justify-between py-4"
          >
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <select
            className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            {timeRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <>
          {renderStatsSkeleton()}
          {renderChartsSkeleton()}
          {renderActivitiesSkeleton()}
        </>
      ) : (
        <>
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
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.activity_type} by {activity.user_id}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}