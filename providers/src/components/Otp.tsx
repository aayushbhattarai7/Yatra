import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Label from "..//ui/common/atoms/Label";
import axios from "axios";
import InputField from "..//ui/common/atoms/InputField";
import Button from "../ui/common/atoms/Button";
import { useMessage } from "../contexts/MessageContext";

interface FormData {
  otp: string;
}
interface OTPprops {
  email: string;
}

const OTP: React.FC<OTPprops> = ({ email }) => {
  const { setMessage } = useMessage();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", data.otp);
      const requestBody = {
        email: email,
        otp: data.otp,
      };
      console.log(data.otp, "ka");
      const response = await axios.post("/travel/verify", requestBody);
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
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col justify-center items-center"
      >
        <div className="mb-4">
          <Label name="otp" label="Enter OTP: " />
          <InputField className="" type="text" name="otp" register={register} />
        </div>
        <Button
          buttonText="Verify"
          name="verify"
          type="submit"
          disabled={isSubmitting}
          className=""
        />
      </form>
    </div>
  );
};

export default OTP;
