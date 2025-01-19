import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { gql, useMutation } from "@apollo/client";

const GoogleLoginMutation = gql`
  mutation Mutation($googleId: String!) {
    googleLogin(googleId: $googleId) {
      id
      accessToken  
    }
  }
`;

interface CustomCredentialResponse {
  credential?: string;
}

const GoogleAuth = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [googleLogin, { error, loading, data }] =
    useMutation(GoogleLoginMutation);

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
        const { accessToken } = response.data.googleLogin;
        console.log("Access Token:", accessToken);
        sessionStorage.setItem("accessToken", accessToken); 
      }
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
