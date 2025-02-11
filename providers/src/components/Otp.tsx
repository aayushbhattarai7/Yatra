import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Label from "../ui/common/atoms/Label";
import InputField from "../ui/common/atoms/InputField";
import Button from "../ui/common/atoms/Button";
import { useMessage } from "../contexts/MessageContext";
import { TRAVEL_OTP } from "../mutation/queries";

interface FormData {
  otp: string;
}

interface OTPProps {
  email: string;
  registerType:  "travel";
}

const OTP: React.FC<OTPProps> = ({ email, registerType }) => {
  const { setMessage } = useMessage();
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await verifyOTP({ variables: { email, otp: data.otp } });
      setMessage(response.data.verifyOtp.message, "success");
      navigate("/login");
    } catch (error) {
    console.log("🚀 ~ constonSubmit:SubmitHandler<FormData>= ~ error:", error)
    }
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
          <InputField type="text" name="otp" register={register} className={""} />
        </div>
        <Button
          buttonText="Verify"
          name="verify"
          type="submit"
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};

export default OTP;
