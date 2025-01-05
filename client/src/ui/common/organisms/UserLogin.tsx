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
    <div className="flex h-screen">
      <div className="w-full md:w-[40%] p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Yatra</h1>
            <h2 className="mt-2 text-lg font-medium">LOGIN</h2>
            <p className="mt-2 text-sm text-gray-600 animate-bounce">
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
        imageUrl="https://images.unsplash.com/photo-1478827536114-da961b7f86d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
      />

      <div className="hidden md-grid grid-cols-12"></div>
    </div>
  );
};

export default UserLogin;
