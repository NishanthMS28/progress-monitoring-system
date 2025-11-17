import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Factory, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Progress Monitor</h1>
              <p className="text-xs text-gray-500">{user?.role === 'owner' ? 'Owner Dashboard' : 'Customer Portal'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div className="text-sm">
                <div className="font-semibold text-gray-800">{user?.name}</div>
                <div className="text-gray-500 text-xs">{user?.email}</div>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

