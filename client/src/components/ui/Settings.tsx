import React from 'react';
import { Compass, KeyRound, Lock, HelpCircle, MessageSquareMore } from 'lucide-react';
// import ThemeToggle from './ThemeToggle';
import LanguageToggle from '../LanguageToggle';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate()
  return (
    <div className="w-72 min-h-screen bg-white/80 backdrop-blur-sm border-r border-sky-100 p-6 shadow-lg">
      <div className="flex items-center space-x-2 mb-8">
        <h2 className="text-2xl font-semibold text-travel-primary">Settings</h2>
      </div>
      
      <div className="space-y-8">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Compass className="w-4 h-4 text-travel-sunset" />
            <h3 className="text-sm font-medium text-travel-sunset">Account Settings</h3>
          </div>
          <div className="space-y-2">
            <button onClick={()=>navigate('/reset-password')} className="flex items-center space-x-3 p-3 hover:bg-sky-50 rounded-xl w-full transition-colors duration-200">
              <KeyRound className="w-5 h-5 text-travel-accent" />
              <span className="text-gray-700">Reset Password</span>
            </button>
            <button onClick={()=> navigate('/update-password')} className="flex items-center space-x-3 p-3 hover:bg-sky-50 rounded-xl w-full transition-colors duration-200">
              <Lock className="w-5 h-5 text-travel-accent" />
              <span className="text-gray-700">Update Password</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Compass className="w-4 h-4 text-travel-forest" />
            <h3 className="text-sm font-medium text-travel-forest">Journey Preferences</h3>
          </div>
          <div className="space-y-2">
            {/* <ThemeToggle /> */}
            <LanguageToggle />
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Compass className="w-4 h-4 text-travel-sand" />
            <h3 className="text-sm font-medium text-travel-sand">Help & Support</h3>
          </div>
          <div className="space-y-2">
            <button className="flex items-center space-x-3 p-3 hover:bg-sky-50 rounded-xl w-full transition-colors duration-200">
              <HelpCircle className="w-5 h-5 text-travel-accent" />
              <span className="text-gray-700">FAQ</span>
            </button>
            <button className="flex items-center space-x-3 p-3 hover:bg-sky-50 rounded-xl w-full transition-colors duration-200">
              <MessageSquareMore className="w-5 h-5 text-travel-accent" />
              <span className="text-gray-700">Support</span>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Settings;