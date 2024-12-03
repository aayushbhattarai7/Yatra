import { gql, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMessage } from "../../../contexts/MessageContext";
import Label from "../atoms/Label";
import { authLabel } from "../../../localization/auth";
import { useLang } from "../../../hooks/useLang";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LOGIN_MUTATION = gql`
  mutation Login($data: LoginDTO!) {
    login(data: $data) {
      firstName
      middleName
      lastName
      phoneNumber
      gender

      email
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

interface FormData {
  email: string;
  password: string;
}

const UserLogin = () => {
  const { setMessage } = useMessage();
  const navigate = useNavigate();
  const { lang } = useLang();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, { data, error }] = useMutation(LOGIN_MUTATION);
  console.log("🚀 ~ UserLogin ~ login:", login);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await login({ variables: { data: formData } });
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<FormData>= ~ response:",
        response
      );
      const { accessToken, refreshToken } = response.data.login.tokens;
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
      Cookies.set("accessToken", accessToken, {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });
      setMessage(data.login.message, "success");
      reset();
      navigate("/");
    } catch (err) {
      console.log(err);
      if (error instanceof Error) {
        const graphqlError = error?.graphQLErrors?.[0]?.message;
        setMessage(graphqlError || "An error occured", "error");
      }
    }
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label name="email" label={authLabel.email[lang]} />
        <InputField
          placeholder={authLabel.email[lang]}
          type="text"
          name="email"
          register={register}
          className=""
        />
      </div>
      <div>
        <Label name="password" label={authLabel.password[lang]} />
        <InputField
          placeholder={authLabel.password[lang]}
          type="password"
          name="password"
          register={register}
          className=""
        />
      </div>
      <Button
        buttonText={authLabel.login[lang]}
        name=""
        type="submit"
        disabled={isSubmitting}
        className="w-full mb-4 bg-blue-500 text-white hover:bg-blue-700"
      />
    </form>
  );
};

export default UserLogin;
