import { useLang } from "@/hooks/useLang";
import RegsiterForm from "./RegisterForm";
import RegisterHero from "./RegisterHero";
import { authLabel } from "@/localization/auth";

const UserRegister = () => {
  const {lang} = useLang()

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full md:w-[55%] p-8 flex flex-col justify-center items-center font-poppins">
        <div className="w-full max-w-md space-y-8 font-poppins">
          <div className="text-center w-[25rem]">
            <h1 className="text-4xl font-bold text-gray-900 font-poppins">
              {authLabel.signup[lang]}
            </h1>
            <p className="mt-2 text-sm text-gray-600 animate-bounce font-poppins">
              {authLabel.startJourney[lang]}
            </p>
          </div>

          <RegsiterForm
          />
        </div>
      </div>
      <RegisterHero
        title={authLabel.Yatra[lang]}
        description={authLabel.desc[lang]}
      />
      <div className="hidden md-grid grid-cols-12"></div>
    </div>
  );
};

export default UserRegister;
