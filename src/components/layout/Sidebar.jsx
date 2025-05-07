import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  MessageSquare,
  CreditCard,
  History,
  BrainCircuit,
  Bell,
  UserX,
  UserMinus,
  Tags,
  Palette,
  FileCheck,
  Activity,
  Mail,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'dashboard' },
  { name: 'User Management', href: '/users', icon: Users, permission: 'users' },
  { name: 'Admin Management', href: '/admins', icon: UserCog, permission: 'admins' },
  // { name: 'Chat Management', href: '/chats', icon: MessageSquare, permission: 'chats' },
  { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard, permission: 'subscriptions' },
  { name: 'Payments', href: '/payments', icon: History, permission: 'payments' },
  { name: 'Questions & Quiz', href: '/questions', icon: BrainCircuit, permission: 'questions' },
  { name: 'Notifications', href: '/notifications', icon: Bell, permission: 'notifications' },
  { name: 'Reported Users', href: '/reported', icon: UserX, permission: 'reported' },
  { name: 'Banned Users', href: '/banned', icon: UserMinus, permission: 'banned' },
  { name: 'Interests', href: '/interests', icon: Tags, permission: 'interests' },
  { name: 'Theme & Settings', href: '/settings', icon: Palette, permission: 'settings' },
  // { name: 'Verifications', href: '/verifications', icon: FileCheck, permission: 'verifications' },
  // { name: 'Activity Logs', href: '/logs', icon: Activity, permission: 'logs' },
  { name: 'Email Templates', href: '/email-templates', icon: Mail, permission: 'emailtemplates' },
  { name: 'Support', href: '/support', icon: HelpCircle, permission: 'support' },
];

export function Sidebar({ onClose, collapsed, onCollapse }) {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter navigation items based on permissions
  const authorizedNavigation = navigation.filter(item => hasPermission(item.permission));

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Dating Admin
          </span>
        )}
        <div className="flex items-center">
          <button
            onClick={() => onCollapse(!collapsed)}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800 lg:block"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 rounded p-1 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {authorizedNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              )
            }
            onClick={onClose}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}