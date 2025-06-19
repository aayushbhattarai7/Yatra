import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Label from "../ui/common/atoms/Label";
import InputField from "../ui/common/atoms/InputField";
import Button from "../ui/common/atoms/Button";
import { showToast } from "./ToastNotification";
import { GUDIE_OTP, GUIDE_RESEND_OTP, TRAVEL_OTP, TRAVEL_RESEND_OTP } from "../mutation/queries";
import { useState } from "react";
import { authLabel } from "../localization/auth";
import { useLang } from "../hooks/useLang";
import ChangePassword from "./ChangePassword";
import { KeyRound, RefreshCw } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../function/GetCookie";

interface FormData {
  otp: string;
}

interface OTPProps {
  email: string;
}

const OTP: React.FC<OTPProps> = ({ email }) => {
    const token = getCookie("accessToken")!
    const decodedToken:{role:"TRAVEL"|"GUIDE"} = jwtDecode(token)
      const mutationMap = {
        TRAVEL: TRAVEL_OTP,
        GUIDE: GUDIE_OTP
    
      };
    
      const [verifyOtp] = useMutation(mutationMap[decodedToken.role]);

      const [travelResendOTP] = useMutation(TRAVEL_RESEND_OTP);
      const [guideResendOTP] = useMutation(GUIDE_RESEND_OTP);
  const [verified, setVerified] = useState<boolean>(false);
  const { register, handleSubmit, control, setValue, reset } = useForm<FormData>();
  const { lang } = useLang();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await verifyOtp({ variables: { email, otp: data.otp } });
      showToast(response.data.verifyOtp, "success");
      setVerified(true); 
      reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("An error occurred", 'error');
      }
    }
  };

  const resendOTP = async () => {
    try {
        const sendQuery = decodedToken.role === "TRAVEL"? travelResendOTP:guideResendOTP
        const res = await sendQuery({ variables: { email } });
        const message = decodedToken.role === "TRAVEL"? res.data.travelResendOTP:res.data.guideResendOTP
      showToast(message, "success");
    } catch (error) {
      showToast("Failed to resend OTP", "error");
    }
  };

  if (verified) {
    return <ChangePassword email={email} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <KeyRound className="w-8 h-8 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{authLabel.verifyOTP[lang]}</h2>
        <p className="text-gray-600 text-center mb-8">
         {authLabel.weSentNotificationTo[lang]}<br />
          <span className="font-medium text-gray-800">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-2">
            <Label 
              name="otp" 
              label={authLabel.EnterOTP[lang]}
              className="text-sm font-medium text-gray-700"
            />
            <InputField
            control={control}
              setValue={setValue}
              placeholder={authLabel.EnterOTP[lang]}
              type="text"
              name="otp"
              register={register}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-wider"
            />
          </div>

          <div className="space-y-4">
            <Button
              buttonText={authLabel.verifyOTP[lang]}
              name="verify"
              type="submit"
              className="w-full"
            />

            <div className="flex items-center gap-2 justify-center">
              {/* <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} /> */}
              {/* <Button
                buttonText={resendLoading ? 'Sending...' : 'Resend Code'}
                name="resend"
                type="button"
                onClick={resendOTP}
                disabled={resendLoading}
                className="text-gray-600 hover:text-gray-800 flex"
              /> */}
              <p className="" onClick={resendOTP} >{authLabel.resendCode[lang]}</p>
            </div>
          </div>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
{authLabel.didnotReceiveCode[lang]}        </p>
      </div>
    </div>
  );
};

export default OTP;