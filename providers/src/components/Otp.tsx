import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Label from "../ui/common/atoms/Label";
import InputField from "../ui/common/atoms/InputField";
import Button from "../ui/common/atoms/Button";
import { TRAVEL_OTP, TRAVEL_RESEND_OTP } from "../mutation/queries";
import { showToast } from "./ToastNotification";

interface FormData {
  otp: string;
}

interface OTPProps {
  email: string;
  registerType: "travel";
}

const OTP: React.FC<OTPProps> = ({ email, registerType }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const mutationMap = {
    travel: TRAVEL_OTP,
  };

  const [verifyOTP] = useMutation(mutationMap[registerType]);
  const [travelResendOTP] = useMutation(TRAVEL_RESEND_OTP);
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await verifyOTP({ variables: { email, otp: data.otp } });
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<FormData>= ~ response:",
        response.data,
      );
      showToast(response.data.travelVerifyOTP, "success");
      navigate("/guide-login");
    } catch (error: any) {
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<FormData>= ~ error:",
        error,
      );
    }
  };

  const resendOTP = async () => {
    const res = await travelResendOTP({ variables: { email } });
    console.log(res.data);
    showToast(res.data.travelResendOTP, "success");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col justify-center items-center"
      >
        <div className="mb-4">
          <Label name="otp" label="Enter OTP:" />
          <InputField
            type="text"
            name="otp"
            register={register}
            className={""}
          />
        </div>
        <Button
          buttonText="Verify"
          name="verify"
          type="submit"
          disabled={isSubmitting}
        />
      </form>
      <Button
        buttonText="Didnot get the code? resend otp"
        className=""
        type="submit"
        onClick={resendOTP}
      />
    </div>
  );
};

export default OTP;
