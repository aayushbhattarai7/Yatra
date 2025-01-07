import { gql, useMutation } from "@apollo/client";
import { SubmitHandler } from "react-hook-form";
import { useMessage } from "../../../contexts/MessageContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginForm from "./LoginForm";
import SocialLogin from "./SocialLogin";
import LoginHero from "./LoginHero";

const LOGIN_MUTATION = gql`
  mutation Login($data: LoginDTO!) {
    login(data: $data) {
      firstName
      middleName
      lastName
      phoneNumber
      gender
      email
      tokens {
        accessToken
        refreshToken
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
  const navigate = useNavigate();
  const [login, { error, loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await login({ variables: { data: formData } });
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
        navigate("/guides");
      } else {
        console.error("No response data:", response);
        setMessage("Unexpected error. Please try again.", "error");
      }
    } catch (err) {
      if (err instanceof Error) {
        const graphqlError = error?.graphQLErrors?.[0]?.message;

        console.error("GraphQL Error:", graphqlError);
        setMessage(graphqlError!, "error");
      } else {
        console.error("Unexpected Error:", err);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full md:w-[55%] p-8 flex flex-col justify-center items-center font-poppins">
        <div className="w-full max-w-md space-y-8 font-poppins">
          <div className="text-center w-[25rem]">
            <h1 className="text-4xl font-bold text-gray-900 font-poppins">
              Login
            </h1>
            <p className="mt-2 text-sm text-gray-600 animate-bounce font-poppins">
              Continue Your Journey with us
            </p>
          </div>

          <LoginForm onSubmit={handleSubmit} isSubmitting={loading} />
          <SocialLogin />
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

export default UserLogin;
