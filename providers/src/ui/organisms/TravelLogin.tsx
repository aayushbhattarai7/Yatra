import { useMutation } from "@apollo/client";
import { SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import LoginHero from "../../../../client/src/ui/common/organisms/LoginHero";
import { showToast } from "../../components/ToastNotification";
import { TRAVEL_LOGIN, TRAVEL_RESEND_OTP } from "../../mutation/queries";
import OTP from "../../components/Otp";
import { useState } from "react";
import LoginForm from "../../components/LoginForm";
import { useSocket } from "../../contexts/SocketContext";

interface FormData {
  email: string;
  password: string;
}

const TravelLogin = () => {
  const [travelLogin, { loading }] = useMutation(TRAVEL_LOGIN);
  const [travelResendOTP] = useMutation(TRAVEL_RESEND_OTP);
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const {socket} = useSocket()

  const handleSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await travelLogin({
        variables: { email: formData.email, password: formData.password },
      });

      if (response.data) {
        const loginData = response.data.travelLogin;

        if (!loginData.verified) {
          await travelResendOTP({ variables: { email: formData.email } });
          showToast("OTP sent to your email", "success");
          setUserEmail(formData.email);
          setShowOTP(true);
          return;
        }

        const { accessToken } = loginData.tokens;
        Cookies.set("accessToken", accessToken, {
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        
        showToast(loginData.message, "success");
        if(socket){
          socket.emit("get-active-travels")
        }
   
        window.location.href = "/travel/home"
      } else {
        showToast("Login failed. Please try again.", "error");
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast(err.message, "error");
        console.error("GraphQL Error:", err);
      } else {
        console.error("Unexpected Error:", err);
      }
    }
  };

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden items-center justify-center">
        <div className="w-full h-full flex flex-col md:flex-row">
          <div className="w-full md:w-[56%] h-full flex flex-col justify-center items-center font-poppins">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center w-full">
                <h1 className="text-4xl font-bold text-gray-900">Login</h1>
                <p className="mt-2 text-sm text-gray-600 animate-bounce">
                  Continue Your Journey with us
                </p>
              </div>
              <LoginForm onSubmit={handleSubmit} isSubmitting={loading} type="travel" />
            </div>

          </div>

          <div className="w-full md:w-[70%] h-full">
            <LoginHero
              title="Yatra"
              description="Travel is the only purchase that enriches you in ways beyond material wealth."
            />
          </div>
        </div>
      </div>
      {showOTP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowOTP(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <OTP email={userEmail} registerType="travel" onClose={() => setShowOTP(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default TravelLogin;