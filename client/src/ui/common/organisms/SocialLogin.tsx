import FacebookSDK from "@/components/FacebookSDK";
import GoogleAuth from "@/components/GoogleLogin";
import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";

const SocialLogin = () => {
  const {lang} = useLang()
  const handleFacebookLogin = (userInfo: any) => {
    console.log("Facebook user info:", userInfo);
  };

  return (
    <div className="mt-6">
      <div className="relative w-[27rem]">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{authLabel.loginOthers[lang]}</span>
        </div>
      </div>

      <div className="mt-6 w-[27rem] flex flex-col justify-center items-center">
        <button
          type="button"
          className="flex w-72 justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
        
          <GoogleAuth />
        </button>
        <br />
        <FacebookSDK onLogin={handleFacebookLogin} />
      </div>
    </div>
  );
};

export default SocialLogin;
