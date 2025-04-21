import { gql, useMutation } from "@apollo/client";
import { SubmitHandler } from "react-hook-form";
import { useMessage } from "../../../contexts/MessageContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginForm from "./LoginForm";
import SocialLogin from "./SocialLogin";
import LoginHero from "./LoginHero";
import { useLang } from "@/hooks/useLang";
import { authLabel  } from "@/localization/auth";
import { showToast } from "@/components/ToastNotification";



const LOGIN_MUTATION = gql`
  mutation Login($password: String!, $email: String!) {
    login(password: $password, email: $email) {
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

const UserLogin = () => {
  const { setMessage } = useMessage();
    const {lang} = useLang()

  const [login, { error, loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      console.log(formData.email, formData.password);
      const response = await login({
        variables: { email: formData.email, password: formData.password },
      });
      if (response.data) {
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
        console.error("No response data:", response);
        setMessage("Unexpected error. Please try again.", "error");
      }
    } catch (err) {
      console.log("🚀 ~ consthandleSubmit:SubmitHandler<FormData>= ~ err:", err)
      if (err instanceof Error) {
        console.log("ohno");

        showToast(err.message!, "error");
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

      <LoginHero
        title={authLabel.Yatra[lang]}

        description={authLabel.desc[lang]}

      />

      <div className="hidden md-grid grid-cols-12"></div>
    </div>
  );
};

export default UserLogin;
