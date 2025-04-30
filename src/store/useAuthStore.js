import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

const allPermissions = [
  'Dashboard',
  'Users',
  'Admins',
  'Content',
  'Settings',
  'Reports',
  'Payments',
  'Subscriptions',
  'Questions',
  'Notifications',
  'Reported',
  'Banned',
  'Interests',
  'IntroScreens',
  'Verifications',
  'Logs',
  'EmailTemplates',
  'Support',
];

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      admin: null,
      isAuthenticated: !!Cookies.get('adminToken'),
      permissions: {},
      setAdmin: (admin) => {
        let permissions = {};
        console.log('permissions', permissions);
        // If admin has specific permissions, use those
        if (admin?.permissions?.length > 0) {
          permissions = admin.permissions.reduce((acc, permission) => {
            acc[permission.toLowerCase()] = true;
            return acc;
          }, {});
        } else {
          // If no permissions specified, grant all permissions
          permissions = allPermissions.reduce((acc, permission) => {
            acc[permission.toLowerCase()] = true;
            return acc;
          }, {});
        }

        set({
          admin,
          isAuthenticated: !!admin,
          permissions
        });
      },
      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions[permission.toLowerCase()] === true;
      },
      logout: () => {
        Cookies.remove('adminToken');
        set({ admin: null, isAuthenticated: false, permissions: {} });
      },
      checkAuth: () => {
        const token = Cookies.get('adminToken');
        const isAuthenticated = !!token;
        set({ isAuthenticated });
        return isAuthenticated;
      },
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({
        admin: state.admin,
        permissions: state.permissions
      }),
    }
  )
);