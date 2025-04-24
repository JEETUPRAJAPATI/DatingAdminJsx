import React, { useState } from 'react';
import { Moon, Sun, Bell, MessageSquare, Video, Users, Shield } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const defaultSettings = [
  {
    id: 'chat',
    name: 'Chat Module',
    description: 'Enable or disable the chat functionality',
    enabled: true,
    icon: MessageSquare,
  },
  {
    id: 'video',
    name: 'Video Calls',
    description: 'Allow users to make video calls',
    enabled: true,
    icon: Video,
  },
  {
    id: 'discover',
    name: 'Discover Feature',
    description: 'Enable user discovery and matching',
    enabled: true,
    icon: Users,
  },
  {
    id: 'notifications',
    name: 'Push Notifications',
    description: 'Send push notifications to users',
    enabled: true,
    icon: Bell,
  },
  {
    id: 'maintenance',
    name: 'Maintenance Mode',
    description: 'Put the app in maintenance mode',
    enabled: false,
    icon: Shield,
  },
];

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(defaultSettings);

  const toggleSetting = (id) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-medium">Theme</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose your preferred theme
        </p>
        <div className="mt-4">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-5 w-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-medium">Features</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enable or disable app features
        </p>
        <div className="mt-4 space-y-4">
          {settings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div
                key={setting.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{setting.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={setting.enabled}
                    onChange={() => toggleSetting(setting.id)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
          Cancel
        </button>
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Save Changes
        </button>
      </div>
    </div>
  );
}
