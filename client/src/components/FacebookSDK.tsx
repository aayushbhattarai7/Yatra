import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useMessage } from "@/contexts/MessageContext";
import { useNavigate } from "react-router-dom";
const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
const apiVersion = import.meta.env.VITE_FACEBOOK_VERSION;

interface FacebookSDKProps {
  onLogin: (userInfo: any) => void;
}

const FACEBOOK_MUTATION = gql`
  mutation Mutation($facebookId: String!) {
    facebookLogin(facebookId: $facebookId) {
      tokens {
        accessToken
      }
    }
  }
`;
const FacebookSDK = ({ onLogin }: FacebookSDKProps) => {
  const { setMessage } = useMessage();
  const navigate = useNavigate();
  const [facebookLogin, { error, loading }] = useMutation(FACEBOOK_MUTATION);
   useEffect(() => {
    const initializeFacebookSDK = () => {
      if (!appId || !apiVersion) {
        console.error(
          "Facebook App ID or API version is not set in environment variables."
        );
        return;
      }

      (window as any).fbAsyncInit = () => {
        (window as any).FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: apiVersion,
        });

        (window as any).FB.AppEvents.logPageView();
      };

      const d = document;
      const s = "script";
      const id = "facebook-jssdk";
      let js: HTMLScriptElement | null = d.getElementById(
        id
      ) as HTMLScriptElement;

      if (!js) {
        js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        js.async = true;
        js.defer = true;

        js.onerror = () => {
          console.error("Failed to load Facebook SDK script.");
        };

        const fjs = d.getElementsByTagName(s)[0];
        fjs.parentNode?.insertBefore(js, fjs);
      }
    };

    initializeFacebookSDK();
  }, []);

  const handleFacebookLogin = () => {
    if (!(window as any).FB) {
      console.error("Facebook SDK is not loaded yet.");
      return;
    }

    (window as any).FB.login(
      (response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          (window as any).FB.api(
            "/me",
            { fields: "first_name,middle_name,last_name,email" },
            (userInfo: any) => {
              onLogin(userInfo);
              handleFacebookMutation(accessToken);
            }
          );
        } else {
          console.error("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  const handleFacebookMutation = async (accessToken: string) => {
    try {
      const res = await facebookLogin({
        variables: { facebookId: accessToken },
      });

      if (res.data) {
     
        const accessToken = res.data.facebookLogin.tokens.accessToken;
        Cookies.set("accessToken", accessToken, {
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        setMessage("Login successful", "success");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during Facebook login mutation:", error);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleFacebookLogin}
      className="flex w-72 justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <img 
        className="h-9 w-9 mr-2"
        src="https://www.facebook.com/favicon.ico"
        alt="Facebook logo"
      />
      Login with Facebook
    </button>
  );
};

export default FacebookSDK;
