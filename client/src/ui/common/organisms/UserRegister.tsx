import { gql, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMessage } from "../../../contexts/MessageContext";

import RegsiterForm from "./RegisterForm";
import RegisterHero from "./RegisterHero";
import SocialRegister from "./SocialRegiser";

const SIGNUP_MUTATION = gql`
  mutation Signup($data: UserDTO!) {
    signup(data: $data) {
      message
    }
  }
`;

interface FormData {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
}

const UserRegister = () => {
  const { setMessage } = useMessage();
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      gender: "",
    },
  });

  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      await signup({ variables: { data: formData } });

      alert(`Signup successful! Welcome, ${data.signup.firstName}!`);
      reset();
    } catch (err) {
      console.error("Error signing up:", err);
      if (err instanceof Error) {
        const graphqlError = error?.graphQLErrors?.[0]?.message;
        setMessage(graphqlError || "An error occured", "error");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full md:w-[55%] p-8 flex flex-col justify-center items-center font-poppins">
        <div className="w-full max-w-md space-y-8 font-poppins">
          <div className="text-center w-[25rem]">
            <h1 className="text-4xl font-bold text-gray-900 font-poppins">
              Signup
            </h1>
            <p className="mt-2 text-sm text-gray-600 animate-bounce font-poppins">
              Continue Your Journey with us
            </p>
          </div>

          <RegsiterForm
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={loading}
          />
          <SocialRegister />
        </div>
      </div>

      <RegisterHero
        title="Yatra"
        description="Travel is the only purchase that enriches you in ways beyond material wealth."
      />

      <div className="hidden md-grid grid-cols-12"></div>
    </div>
  );
};

export default UserRegister;
