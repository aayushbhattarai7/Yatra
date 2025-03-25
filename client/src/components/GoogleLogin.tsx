import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { gql, useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useMessage } from "@/contexts/MessageContext";
const GoogleLoginMutation = gql`
  mutation GoogleLogin($googleId: String!) {
    googleLogin(googleId: $googleId) {
      id
      tokens {
        accessToken
      }
    }
  }
`;

interface CustomCredentialResponse {
  credential?: string;
}

const GoogleAuth = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const { setMessage } = useMessage();
  const [googleLogin] = useMutation(GoogleLoginMutation);

  const handleSuccess = async (
    credentialResponse: CustomCredentialResponse
  ) => {
    const id = credentialResponse.credential;

    if (typeof id !== "string" || id.trim() === "") {
      console.log("Invalid token", id);
      return;
    }

    try {
      const response = await googleLogin({ variables: { googleId: id } });

      if (response.data) {
        const { accessToken } = response.data.googleLogin.tokens;
        Cookies.set("accessToken", accessToken, {
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        setMessage("Login successful", "success");
window.location.href="/"      }
    } catch (error) {
      console.log("🚀 ~ handleSuccess ~ error:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
