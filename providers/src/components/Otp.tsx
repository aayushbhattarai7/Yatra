import React from 'react';
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { Cross, CrossIcon, KeyRound } from 'lucide-react';
import Label from "../ui/common/atoms/Label";
import InputField from "../ui/common/atoms/InputField";
import Button from "../ui/common/atoms/Button";
import { GUDIE_OTP, GUIDE_RESEND_OTP, TRAVEL_OTP, TRAVEL_RESEND_OTP } from "../mutation/queries";
import { showToast } from "./ToastNotification";
import { IoClose } from 'react-icons/io5';

interface FormData {
  otp: string;
}

interface OTPProps {
  email: string;
  registerType: "travel" | "guide";
  onClose:()=>void
}

const OTP: React.FC<OTPProps> = ({ email, registerType, onClose }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const mutationMap = {
    travel: TRAVEL_OTP,
    guide: GUDIE_OTP
  };

  const [verifyOTP] = useMutation(mutationMap[registerType]);
  const [travelResendOTP] = useMutation(TRAVEL_RESEND_OTP);
  const [guideResendOTP] = useMutation(GUIDE_RESEND_OTP);
  
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await verifyOTP({ variables: { email, otp: data.otp } });
      const message = registerType === "travel" ? response.data.travelVerifyOTP : response.data.guideVerifyOTP;
      showToast(message, "success");
      const navigateTo = registerType === "travel" ? "/travel-login" : "/guide-login";
      navigate(navigateTo);
    } catch (error: any) {
      showToast(error.message || "Verification failed", "error");
      console.error("Verification error:", error);
    }
  };

  const resendOTP = async () => {
    const resend = registerType === "travel" ? travelResendOTP : guideResendOTP;
    try {
      const res = await resend({ variables: { email } });
      const message = registerType === "travel" ? res.data.travelResendOTP : res.data.guideResendOTP;
      showToast(message, "success");
    } catch (error: any) {
      showToast(error.message || "Failed to resend OTP", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className='flex justify-end w-full'>

      <p><IoClose onClick={onClose}/></p>
        </div>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <KeyRound className="w-8 h-8 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-gray-600 text-center mb-8">
          We sent a verification code to<br />
          <span className="font-medium text-gray-800">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-2">
            <Label 
              name="otp" 
              label="Enter OTP:"
              className="text-sm font-medium text-gray-700"
            />
            <InputField
              setValue={setValue}
              placeholder="Enter your verification code"
              type="text"
              name="otp"
              register={register}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-wider"
            />
          </div>

          <div className="space-y-4">
            <Button
              buttonText="Verify"
              name="verify"
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            />

            <div className="flex items-center gap-2 justify-center">
              <p 
                className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium"
                onClick={resendOTP}
              >
                Didn't receive the code? Resend OTP
              </p>
            </div>
          </div>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Please enter the code within 10 minutes
        </p>
      </div>
    </div>
  );
};

export default OTP;