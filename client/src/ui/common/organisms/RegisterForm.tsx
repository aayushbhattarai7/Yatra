import { SubmitHandler, useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import Label from "../atoms/Label";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { authLabel } from "../../../localization/auth";
import { useLang } from "../../../hooks/useLang";
import { RiLockPasswordLine } from "react-icons/ri";

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface RegisterFormProps {
  onSubmit: SubmitHandler<FormData>;
  isSubmitting: boolean;
}

const RegsiterForm = ({ onSubmit, isSubmitting }: RegisterFormProps) => {
  const { lang } = useLang();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 space-y-6 flex justify-center items-center flex-col"
    >
      <div className="space-y-4">
        <div className="flex gap-10">
          <div>
            <Label name="First Name" className="pl-3" label={"First Name"} />
            <div className="relative">
              <InputField
                placeholder={"First Name"}
                type="text"
                name="firstName"
                register={register}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <Label name="Middle Name" className="pl-3" label={"Middle Name"} />
            <div className="relative">
              <InputField
                placeholder={"Middle Name"}
                type="text"
                name="middleName"
                register={register}
                className="block w-[16rem]  pl-11 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-10">
          <div>
            <Label name="lastname" className="pl-3" label={"Last Name"} />
            <div className="relative">
              <InputField
                placeholder={authLabel.lastName[lang]}
                type="text"
                name="lastName"
                register={register}
                className="block w-[16rem]  pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <Label
              name="email"
              className="pl-3"
              label={authLabel.email[lang]}
            />
            <div className="relative">
              <InputField
                placeholder={authLabel.email[lang]}
                type="text"
                name="email"
                register={register}
                className="block w-[16rem]  pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-10">
          <div>
            <Label
              name="phone number"
              className="pl-3"
              label={"phone number"}
            />
            <div className="relative">
              <InputField
                placeholder={"phone number"}
                type="text"
                name="phoneNumber"
                register={register}
                className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div>
                <Label
                  name="password"
                  className="pl-3"
                  label={authLabel.password[lang]}
                />
                <div className="relative">
                  <InputField
                    placeholder={authLabel.password[lang]}
                    type="password"
                    name="password"
                    icon={<RiLockPasswordLine />}
                    register={register}
                    className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[23rem] flex justify-center items-center">
        <Button
          buttonText={authLabel.signup[lang]}
          name=""
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default RegsiterForm;
