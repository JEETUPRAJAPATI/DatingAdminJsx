import api from '../lib/axios';

export interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  activeUsers: number;
  bannedUsers: number;
  reportedUsers: number;
  totalPayments: number;
  monthlyRevenue: number;
  activeChats: number;
}

export interface RecentActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  timestamp: string;
  user: string;
  time: string;
  action: string;
}

export const getDashboardStats = async () => {
  // Using dummy data for now since the API is not ready
  return {
    totalUsers: 5000,
    premiumUsers: 545,
    activeUsers: 4500,
    bannedUsers: 50,
    reportedUsers: 5454,
    totalPayments: 100000,
    monthlyRevenue: 5000,
    activeChats: 43,
  };
};

export const getRecentActivities = async () => {
  // Using dummy data for now since the API is not ready
  return {
    data: [
      {
        id: '1',
        user_id: 'user_101',
        activity_type: 'Subscription',
        description: 'User purchased Gold Plan',
        timestamp: new Date().toISOString(),
        user: 'John Smith',
        time: '2 minutes ago',
        action: 'Purchased Gold Plan'
      },
      {
        id: '2',
        user_id: 'user_102',
        activity_type: 'Login',
        description: 'User logged in',
        timestamp: new Date().toISOString(),
        user: 'Sarah Wilson',
        time: '5 minutes ago',
        action: 'Logged in'
      },
      {
        id: '3',
        user_id: 'user_103',
        activity_type: 'Profile',
        description: 'Updated profile information',
        timestamp: new Date().toISOString(),
        user: 'Mike Johnson',
        time: '10 minutes ago',
        action: 'Updated profile'
      },
      {
        id: '4',
        user_id: 'user_104',
        activity_type: 'Message',
        description: 'Sent new message',
        timestamp: new Date().toISOString(),
        user: 'Emily Brown',
        time: '15 minutes ago',
        action: 'Sent message'
      },
      {
        id: '5',
        user_id: 'user_105',
        activity_type: 'Verification',
        description: 'Account verified',
        timestamp: new Date().toISOString(),
        user: 'David Wilson',
        time: '20 minutes ago',
        action: 'Account verified'
      }
    ]
  };
};