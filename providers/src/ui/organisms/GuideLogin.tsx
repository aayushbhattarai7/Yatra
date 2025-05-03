import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import { showToast } from "../../components/ToastNotification";
import OTP from "../../components/Otp";
import { GUIDE_RESEND_OTP } from "../../mutation/queries";
import LoginForm from "../../components/LoginForm";
import LoginHero from "../../../../client/src/ui/common/organisms/LoginHero";
import { useSocket } from "../../contexts/SocketContext";

const LOGIN_MUTATION = gql`
  mutation GuideLogin($password: String!, $email: String!) {
    guideLogin(password: $password, email: $email) {
      message
      verified
      tokens {
        accessToken
      }
    }
  }
`;

interface FormData {
  email: string;
  password: string;
}

const GuideLogin = () => {
  const [guideLogin, { loading }] = useMutation(LOGIN_MUTATION);
  const [guideResendOTP] = useMutation(GUIDE_RESEND_OTP);

  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const {socket} = useSocket()

  const handleSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await guideLogin({
        variables: { email: formData.email, password: formData.password },
      });

      if (response.data) {
        const loginData = response.data.guideLogin;

        if (!loginData.verified) {
          await guideResendOTP({ variables: { email: formData.email } });
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
   
        window.location.href = "/guide/home"
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
      <div className="flex h-screen items-center justify-center">
        <div className="w-full md:w-[55%] p-8 flex flex-col justify-center items-center font-poppins">
          <div className="w-full max-w-md space-y-8 font-poppins">
            <div className="text-center w-[29rem]">
              <h1 className="text-4xl font-bold text-gray-900 font-poppins">Login</h1>
              <p className="mt-2 text-sm text-gray-600 animate-bounce font-poppins">
                Continue Your Journey with us
              </p>
            </div>

            <LoginForm onSubmit={handleSubmit} isSubmitting={loading} type="guide"/>
          </div>
        </div>

        <LoginHero
          title="Yatra"
          description="Travel is the only purchase that enriches you in ways beyond material wealth."
        />
      </div>

      {showOTP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-full">
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
            <OTP email={userEmail} registerType="guide"  onClose={()=>setShowOTP(false)}/>
          </div>
        </div>
      )}
    </>
  );
};

export default GuideLogin;