import { gql, useMutation } from "@apollo/client";
import { SubmitHandler } from "react-hook-form";
import { useMessage } from "../../../contexts/MessageContext";
import Cookies from "js-cookie";
import LoginForm from "./LoginForm";
import SocialLogin from "./SocialLogin";
import LoginHero from "./LoginHero";
import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";
import { showToast } from "@/components/ToastNotification";
import { useState } from "react";
import OTP from "@/components/Otp";

const LOGIN_MUTATION = gql`
  mutation Login($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      tokens {
        accessToken
        refreshToken
      }
      verified
      email
    }
  }
`;

interface FormData {
  email: string;
  password: string;
}

const UserLogin = () => {
  const { setMessage } = useMessage();
  const { lang } = useLang();
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const [otp, setOtp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await login({
        variables: { email: formData.email, password: formData.password },
      });
      if (response.data) {
        const verified = response.data.login.verified;
        const email = response.data.login.email;
        setEmail(email);
        if (!verified) {
          setOtp(true);
          return;
        }
        const { accessToken, refreshToken } = response.data.login.tokens;
        Cookies.set("accessToken", accessToken, {
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("refreshToken", refreshToken, {
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        setMessage("Login successful", "success");
        window.location.href = "/";
      } else {
        setMessage("Unexpected error. Please try again.", "error");
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        console.error("Unexpected Error:", err);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full md:w-[55%] p-8 flex flex-col justify-center items-center font-poppins">
        <div className="w-full max-w-md space-y-8 font-poppins">
          <div className="text-center w-[29rem]">
            <h1 className="text-4xl font-bold text-gray-900 font-poppins">
              {authLabel.login[lang]}
            </h1>
            <p className="mt-2 text-sm text-gray-600 animate-bounce font-poppins">
              {authLabel.continueJourney[lang]}
            </p>
          </div>
          <LoginForm onSubmit={handleSubmit} isSubmitting={loading} />
          <SocialLogin />
        </div>
        
      </div>
      <LoginHero title={authLabel.Yatra[lang]} description={authLabel.desc[lang]} />
      <div className="hidden md-grid grid-cols-12"></div>
      {otp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className=" p-6 rounded-xl shadow-lg">
            <OTP email={email} onClose={()=>setOtp(false)}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
