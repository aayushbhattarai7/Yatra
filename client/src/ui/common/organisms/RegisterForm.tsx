import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { RiLockPasswordLine } from "react-icons/ri";
import Label from "../atoms/Label";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { authLabel } from "../../../localization/auth";
import { useLang } from "../../../hooks/useLang";
import { showToast } from "@/components/ToastNotification";
import { NavLink, useNavigate } from "react-router-dom";

interface FormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: "MALE" | "FEMALE";
}

const SIGNUP_MUTATION = gql`
  mutation Signup(
    $password: String!
    $gender: String!
    $phoneNumber: String!
    $email: String!
    $lastName: String!
    $firstName: String!
  ) {
    signup(
      password: $password
      gender: $gender
      phoneNumber: $phoneNumber
      email: $email
      lastName: $lastName
      firstName: $firstName
    )
  }
`;

const RegisterForm = () => {
  const { lang } = useLang();
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);
  const { register, handleSubmit, setValue, reset } = useForm<FormData>();
const navigate = useNavigate()
  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      await signup({ variables: { ...formData } });
navigate("/user-login")
      showToast(`Signup successful! Welcome, ${formData.firstName}!`, "success");
      reset();
    } catch (err:unknown) {
      console.error("Error signing up:", err);
      if(err instanceof Error)
      showToast(err.message, "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 space-y-6 flex justify-center items-center flex-col"
    >
      <div className="space-y-4">
        <div className="flex gap-10">
          <div>
            <Label name="firstName" className="pl-3" label={authLabel.firstName[lang]} />
            <InputField
              setValue={setValue}
              placeholder={authLabel.firstName[lang]}
              type="text"
              name="firstName"
              register={register}
              className="block w-[16rem] pl-11 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <Label name="middleName" className="pl-3" label={authLabel.middleName[lang]} />
            <InputField
              setValue={setValue}
              placeholder={authLabel.middleName[lang]}
              type="text"
              name="middleName"
              register={register}
              className="block w-[16rem] pl-11 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
        <div className="flex gap-10">
          <div>
            <Label name="lastName" className="pl-3" label={authLabel.lastName[lang]} />
            <InputField
              setValue={setValue}
              placeholder={authLabel.lastName[lang]}
              type="text"
              name="lastName"
              register={register}
              className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <Label name="email" className="pl-3" label={authLabel.email[lang]} />
            <InputField
              setValue={setValue}
              placeholder={authLabel.email[lang]}
              type="text"
              name="email"
              register={register}
              className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <div className="flex gap-10">
          <div>
            <Label name="phoneNumber" className="pl-3" label={authLabel.phoneNumber[lang]} />
            <InputField
              setValue={setValue}
              placeholder={authLabel.phoneNumber[lang]}
              type="text"
              name="phoneNumber"
              register={register}
              className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <Label name="password" className="pl-3" label={authLabel.password[lang]} />
            <InputField
              setValue={setValue}
              placeholder={authLabel.password[lang]}
              type="password"
              name="password"
              icon={<RiLockPasswordLine />}
              register={register}
              className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <div className="flex gap-10">
          <div>
            <Label name="gender" className="pl-3" label={authLabel.gender[lang]} />
            <select
              {...register("gender", { required: true })}
              className="block w-[16rem] pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            >
              <option value="MALE">{authLabel.male[lang]}</option>
              <option value="FEMALE">{authLabel.female[lang]}</option>
            </select>
          </div>
        </div>
      </div>
      <div className="py-2">
            <NavLink to={"/user-login"} className={"text-blue-500 underline"}>
            {authLabel.alreadyHaveAnAccount[lang]}
            </NavLink>
          </div>
      <div className="w-[23rem] flex justify-center items-center">
        <Button buttonText={authLabel.signup[lang]} type="submit" disabled={loading} />
      </div>
    </form>
  );
};

export default RegisterForm;
