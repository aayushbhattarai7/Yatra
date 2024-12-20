import { gql, useMutation } from "@apollo/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMessage } from "../../../contexts/MessageContext";

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
  role: "GUIDE" | "USER" | "ADMIN";
  gender: "MALE" | "FEMALE" | "OTHER";
}

const UserRegister = () => {
  const {setMessage}  = useMessage()
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      role: "USER",
      gender: "MALE",
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
        const graphqlError = error?.graphQLErrors?.[0]?.message
        setMessage(graphqlError || 'An error occured',"error")
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          Email:
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
        </label>
      </div>
      <div>
        <label>
          First Name:
          <input
            type="text"
            {...register("firstName", { required: "First Name is required" })}
          />
        </label>
      </div>
      <div>
        <label>
          Middle Name:
          <input type="text" {...register("middleName")} />
        </label>
      </div>
      <div>
        <label>
          Last Name:
          <input
            type="text"
            {...register("lastName", { required: "Last Name is required" })}
          />
        </label>
      </div>
      <div>
        <label>
          Phone Number:
          <input
            type="tel"
            {...register("phoneNumber", {
              required: "Phone Number is required",
            })}
          />
        </label>
      </div>
      <div>
        <label>
          Role:
          <select {...register("role", { required: "Role is required" })}>
            <option value="GUIDE">Guide</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Gender:
          <select {...register("gender", { required: "Gender is required" })}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default UserRegister;
