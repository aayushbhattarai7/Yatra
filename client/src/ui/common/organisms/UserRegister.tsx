import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { useMessage } from "../../../contexts/MessageContext";
import { Button } from "@/components/ui/button";
import Input from "../atoms/InputField";
import Label from "../../common/atoms/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Facebook, Mail } from "lucide-react";
import InputField from "../atoms/InputField";

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
      role: "USER",
      gender: "MALE",
    },
  });

  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);

  const onSubmit = async (formData: FormData) => {
    try {
      await signup({ variables: { data: formData } });
      alert(`Signup successful! Welcome, ${data.signup.firstName}!`);
      reset();
    } catch (err) {
      console.error("Error signing up:", err);
      if (err instanceof Error) {
        const graphqlError = error?.graphQLErrors?.[0]?.message;
        setMessage(graphqlError || "An error occurred", "error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
        <Card className="w-full p-6 bg-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">SIGNUP</CardTitle>
            <CardDescription>Start Your journey with us</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label name="" label="" />
                  <Input
                    register={register}
                    className=""
                    placeholder="Enter your first name"
                    {...register("firstName", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label name="" label="" />
                  <Input
                    register={register}
                    className=""
                    placeholder="Enter your middle name"
                    {...register("middleName")}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label name="" label="" />
                  <Input
                    register={register}
                    className=""
                    placeholder="Enter your last name"
                    {...register("lastName", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label name="" label="" />
                  <Select {...register("gender")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label name="" label="" />
                <InputField
                  register={register}
                  className=""
                  type="email"
                  placeholder="info@example.com"
                  {...register("email", { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label name="" label="" />
                <InputField
                  type="tel"
                  className=""
                  register={register}
                  placeholder="+977 98XXXXXXXX"
                  {...register("phoneNumber", { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label name="" label="" />
                <Input
                  register={register}
                  className=""
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label name="" label="" />
                
                <Select {...register("role")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="GUIDE">Guide</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Signup with Others
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button">
                  <Mail className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button variant="outline" type="button">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="hidden md:block relative rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1580137189272-c9379f8864fd?q=80&w=1470&auto=format&fit=crop"
            alt="Yatra"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-8 text-white">
            <h2 className="text-4xl font-bold mb-4">Yatra</h2>
            <p className="text-lg">
              Travel is the only purchase that enriches you in ways beyond
              material wealth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
