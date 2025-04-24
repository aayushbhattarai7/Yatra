import { SubmitHandler, useForm } from "react-hook-form";
import Label from "../atoms/Label";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { authLabel } from "../../../localization/auth";
import { useLang } from "../../../hooks/useLang";
import { RxPerson } from "react-icons/rx";
import { RiLockPasswordLine } from "react-icons/ri";
import {  NavLink } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: SubmitHandler<FormData>;
  isSubmitting: boolean;
}

const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps) => {
  const { lang } = useLang();
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 space-y-6 flex justify-center items-center flex-col"
    >
      <div className="space-y-4">
        <div>
          <Label name="email" label={authLabel.email[lang]} />
          <div className="relative">
            <InputField
              setValue={setValue}
              placeholder={authLabel.email[lang]}
              type="email"
              name="email"
              register={register}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson className="font-bold" />}
            />
          </div>
        </div>
        <div>
          <Label name="password" label={authLabel.password[lang]} />
          <div className="relative">
            <InputField
              setValue={setValue}
              placeholder={authLabel.password[lang]}
              type="password"
              name="password"
              icon={<RiLockPasswordLine />}
              register={register}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            /> </div>
          <div className="py-2">
            <NavLink to={"/reset-password"} className={"text-blue-500 underline"}>
            {authLabel.forgotPassword[lang]}
            </NavLink>
          </div>
          <div className="py-2">
            <NavLink to={"/guide-register"} className={"text-blue-500 underline"}>
            {authLabel.dontHaveAnAccount[lang]}
            </NavLink>
          </div>
        </div>
      </div>
      <div></div>
      <div className="w-[23rem] flex justify-center items-center">
        <Button
          buttonText={authLabel.login[lang]}
          name=""
          type="submit"
          disabled={isSubmitting}/>
      </div>
    </form>
  );
};
export default LoginForm;
