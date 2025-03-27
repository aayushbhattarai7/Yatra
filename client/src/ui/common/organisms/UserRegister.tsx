import RegsiterForm from "./RegisterForm";
import RegisterHero from "./RegisterHero";
// import SocialRegister from "./SocialRegiser";


const UserRegister = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full md:w-[55%] p-8 flex flex-col justify-center items-center font-poppins">
        <div className="w-full max-w-md space-y-8 font-poppins">
          <div className="text-center w-[25rem]">
            <h1 className="text-4xl font-bold text-gray-900 font-poppins">
              Signup
            </h1>
            <p className="mt-2 text-sm text-gray-600 animate-bounce font-poppins">
              Continue Your Journey with us
            </p>
          </div>

          <RegsiterForm
          />
          {/* <SocialRegister /> */}
        </div>
      </div>
      <RegisterHero
        title="Yatra"
        description="Travel is the only purchase that enriches you in ways beyond material wealth."
      />
      <div className="hidden md-grid grid-cols-12"></div>
    </div>
  );
};

export default UserRegister;
