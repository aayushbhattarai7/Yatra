import React from "react";
import {
  Compass,
  KeyRound,
  Lock,
  HelpCircle,
  MessageSquareMore,
  X,
} from "lucide-react";
import FAQ from "./FAQ";
import ForgotPassword from "./ForgotPassword";
import UpdatePassword from "./UpdatePassword";
import Support from "./Support";

const Settings = () => {
  const [activeSection, setActiveSection] = React.useState<null | string>(null);

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div
        className={`transition-all duration-300 bg-white shadow-md border-r border-gray-200 p-6 h-full 
        ${activeSection ? "hidden md:block md:w-64 lg:w-80" : "w-full md:w-64 lg:w-80"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-travel-primary">
            Settings
          </h2>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Compass className="w-4 h-4 text-travel-sunset" />
              <h3 className="text-sm font-medium text-travel-sunset">
                Account Settings
              </h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection("forgotPassword")}
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg w-full transition"
              >
                <KeyRound className="w-5 h-5 text-travel-accent" />
                <span className="text-gray-700">Reset Password</span>
              </button>
              <button
                onClick={() => setActiveSection("updatePassword")}
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg w-full transition"
              >
                <Lock className="w-5 h-5 text-travel-accent" />
                <span className="text-gray-700">Update Password</span>
              </button>
            </div>
          </div>
          <div>
         
        
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Compass className="w-4 h-4 text-travel-sand" />
              <h3 className="text-sm font-medium text-travel-sand">
                Help & Support
              </h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection("faq")}
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg w-full transition"
              >
                <HelpCircle className="w-5 h-5 text-travel-accent" />
                <span className="text-gray-700">FAQ</span>
              </button>
              <button
                onClick={() => setActiveSection("support")}
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg w-full transition"
              >
                <MessageSquareMore className="w-5 h-5 text-travel-accent" />
                <span className="text-gray-700">Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 bg-white p-6 md:p-8 w-full md:flex-1 shadow-lg 
        ${activeSection ? "block" : "hidden md:block"}`}
      >
        {activeSection && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-travel-primary">
                {activeSection === "faq"
                  ? "Frequently Asked Questions"
                  : activeSection === "forgotPassword"
                  ? "Reset Password"
                  : activeSection === "updatePassword"
                  ? "Update Password"
                  : "Support"}
              </h2>
              <button
                onClick={() => setActiveSection(null)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {activeSection === "faq" && <FAQ />}
            {activeSection === "forgotPassword" && <ForgotPassword />}
            {activeSection === "updatePassword" && <UpdatePassword />}
            {activeSection === "support" && <Support />}

          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
