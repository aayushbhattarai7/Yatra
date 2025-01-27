import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { RxPerson } from "react-icons/rx";
import { RiLockPasswordLine } from "react-icons/ri";
import backgroundImage1 from "../../../assets/pexels-andreimike-1271619.jpg";
import backgroundImage2 from "../../../assets/pexels-creative-vix-9754.jpg";
import backgroundImage3 from "../../../assets/pexels-hikaique-775201.jpg";
import Label from "../atoms/Label";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { authLabel } from "../../../localization/auth";
import { useLang } from "../../../hooks/useLang";

interface FormData {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const images = [backgroundImage1, backgroundImage2, backgroundImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { lang } = useLang();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  const onSubmit = (data: FormData) => {
    console.log("Login Data:", data);
  };

  return (
    <div className="flex h-screen">
      <div
        className="hidden md:block md:w-[60%] bg-cover bg-center"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      >
        <div className="h-full flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-5xl font-bold mb-4 font-poppins">
            Welcome to Admin Panel
          </h2>
          <p className="text-xl text-center font-poppins">
            Manage your application seamlessly.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md"
        >
          <div className="space-y-4">
            <div className="text-center w-[29rem]">
              <h1 className="text-4xl font-bold text-gray-900 font-poppins">
                Login
              </h1>
              <p className="mt-2 text-sm text-gray-600 animate-bounce font-poppins">
                Continue Your Journey with us
              </p>
            </div>
            <div>
              <Label name="email" label={authLabel.email[lang]} />
              <div className="relative">
                <InputField
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
                  placeholder={authLabel.password[lang]}
                  type="password"
                  name="password"
                  register={register}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  icon={<RiLockPasswordLine />}
                />
              </div>
              <div className="py-2">
               
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              buttonText={authLabel.login[lang]}
              name=""
              type="submit"
              disabled={false}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
