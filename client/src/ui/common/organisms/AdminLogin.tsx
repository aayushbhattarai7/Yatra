import { gql, useMutation } from "@apollo/client";
import { SubmitHandler } from "react-hook-form";
import { useMessage } from "../../../contexts/MessageContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginForm from "./LoginForm";
import LoginHero from "./LoginHero";
import { showToast } from "@/components/ToastNotification";

const LOGIN_MUTATION = gql`
  mutation AdminLogin($password: String!, $email: String!) {
    adminLogin(password: $password, email: $email) {
      message
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

const AdminLogin = () => {
  const { setMessage } = useMessage();
  const navigate = useNavigate();
  const [adminLogin, { error, loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      console.log(formData.email, formData.password);
      const response = await adminLogin({
        variables: { email: formData.email, password: formData.password },
      });
      if (response.data) {
        const { accessToken } = response.data.adminLogin.tokens;
        Cookies.set("accessToken", accessToken, {
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        showToast(response.data.message, "success");
        navigate("/admin");
      } else {
        console.error("No response data:", response);
        showToast(response.data.message, "error");
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
              Login
            </h1>
            <p className="mt-2 text-sm text-gray-600 animate-bounce font-poppins">
              Continue Your Journey with us
            </p>
          </div>

          <LoginForm onSubmit={handleSubmit} isSubmitting={loading} />
        </div>
      </div>

      <LoginHero
        title="Yatra"
        description="Travel is the only purchase that enriches you in ways beyond material wealth."
      />

      <div className="hidden md-grid grid-cols-12"></div>
    </div>
  );
};

export default AdminLogin;
