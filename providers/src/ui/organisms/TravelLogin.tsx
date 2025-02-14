import { useMutation } from "@apollo/client";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginForm from "../../../../client/src/ui/common/organisms/LoginForm";
import LoginHero from "../../../../client/src/ui/common/organisms/LoginHero";
import { showToast } from "../../components/ToastNotification";
import { TRAVEL_LOGIN } from "../../mutation/queries";
import OTP from "../../components/Otp";
import { useState } from "react";

interface FormData {
  email: string;
  password: string;
}

const TravelLogin = () => {
  const navigate = useNavigate();
  const [travelLogin, { loading }] = useMutation(TRAVEL_LOGIN);
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");

  const handleSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      console.log(formData.email, formData.password);
      const response = await travelLogin({
        variables: { email: formData.email, password: formData.password },
      });
      console.log(
        "🚀 ~ consthandleSubmit:SubmitHandler<FormData>= ~ response:",
        response,
      );
      setEmail(formData.email);
      if (response.data) {
        console.log(response.data.travelLogin.verified, "--------------------");
        if (!response.data.travelLogin.verified) {
          setIsVerified(false);
        } else {
          const { accessToken } = response.data.travelLogin.tokens;

          Cookies.set("accessToken", accessToken, {
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
          showToast(response.data.travelLogin.message, "success");
          navigate("/travel/home");
        }
      } else {
        console.error("No response data:", response);
        showToast(response.data.travelLogin.message, "error");
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
    <div className="flex h-screen w-screen overflow-hidden items-center justify-center">
      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-[55%] h-full flex flex-col justify-center items-center font-poppins">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center w-full">
              <h1 className="text-4xl font-bold text-gray-900">Login</h1>
              <p className="mt-2 text-sm text-gray-600 animate-bounce">
                Continue Your Journey with us
              </p>
            </div>
            <LoginForm onSubmit={handleSubmit} isSubmitting={loading} />
          </div>
        </div>

        <div className="w-full md:w-[70%] h-full">
          <LoginHero
            title="Yatra"
            description="Travel is the only purchase that enriches you in ways beyond material wealth."
          />
        </div>
      </div>

      {!isVerified && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <OTP email={email} registerType="travel" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelLogin;
