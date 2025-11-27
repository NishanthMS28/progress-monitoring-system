import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Factory, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout, updateUser } = useAuth();
  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800">Progress Monitor</h1>
              <p className="text-xs text-gray-500">{user?.role === 'owner' ? 'Owner Dashboard' : 'Customer Portal'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div className="text-sm">
                <div className="font-semibold text-gray-800">{user?.name}</div>
                <div className="text-gray-500 text-xs">{user?.email}</div>
              </div>
            </div>

            {user?.role === 'customer' && (
              <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs font-medium text-gray-600 hidden sm:inline">Email Updates</span>
                <button
                  onClick={async () => {
                    try {
                      await updateUser({ emailNotifications: !user?.emailNotifications });
                    } catch (err) {
                      console.error('Failed to toggle notifications', err);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${user?.emailNotifications !== false ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user?.emailNotifications !== false ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            )}

            <button onClick={logout} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

