import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Label from "../ui/common/atoms/Label";
import axios from "axios";
import InputField from "../ui/common/atoms/InputField";
import Button from "../ui/common/atoms/Button";
import { useMessage } from "../contexts/MessageContext";

interface FormData {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
}

interface OTPProps {
  email: string;
}

const OTP: React.FC<OTPProps> = ({ email }) => {
  const { setMessage } = useMessage();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const handleOTPChange = (index: number, value: string) => {
    if (value.length === 1 && index < 4) {
      setFocus(`otp${index + 2}` as keyof FormData);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const otp = `${data.otp1}${data.otp2}${data.otp3}${data.otp4}${data.otp5}`;
      const response = await axios.post("/travel/verify", { email, otp });
      setMessage(response.data.message, "success");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "An error occurred",
          "error"
        );
      } else {
        setMessage("Required fields should not be empty", "error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <Label name="otp" label="Enter OTP:" />
        <div className="flex gap-3 my-4">
          {[...Array(5)].map((_, index) => (
            <InputField
              setValue={setValue}
              key={index}
              type="text"
              name={`otp${index + 1}` as keyof FormData}
              maxLength={1}
              register={register}
              value={watch(`otp${index + 1}` as keyof FormData) || ""}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              className="w-12 h-12 text-xl text-center border border-black bg-[#F0EDFF] outline-none rounded-lg"
            />
          ))}
        </div>
        <Button
          buttonText="Verify"
          name="verify"
          type="submit"
          disabled={isSubmitting}
          className="mt-2"
        />
      </form>
    </div>
  );
};

export default OTP;
