import { Facebook } from "lucide-react";

const SocialLogin = () => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Login with Others</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <img
            className="h-5 w-5 mr-2"
            src="https://www.google.com/favicon.ico"
            alt="Google logo"
          />
          Google
        </button>
        <button
          type="button"
          className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Facebook className="h-5 w-5 mr-2 text-blue-600" />
          Facebook
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
