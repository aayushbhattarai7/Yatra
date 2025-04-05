import { SubmitHandler, useForm } from "react-hook-form";
import {  RiImageAddFill } from "react-icons/ri";
import Label from "../atoms/Label";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { authLabel } from "../../../localization/auth";
import { useLang } from "../../../hooks/useLang";
import { showToast } from "@/components/ToastNotification";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "@/service/axiosInstance";
import { useState } from "react";

interface FormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: "MALE" | "FEMALE";
  profile?: File;
  cover?: File;
}

const RegisterForm = () => {
  const { lang } = useLang();
  const { register, handleSubmit, setValue, reset } = useForm<FormData>();
  const navigate = useNavigate();

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = event.target.files?.[0];
    if (file) {
      setValue(type, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        type === "profile" ? setProfilePreview(reader.result as string) : setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("middleName", formData.middleName || "");
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("gender", formData.gender);
      if (formData.profile) formDataToSend.append("profile", formData.profile);
      if (formData.cover) formDataToSend.append("cover", formData.cover);

      const response = await axiosInstance.post("/user/signup", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("🚀 ~ Signup Success:", response);
      navigate("/user-login");

      showToast(`Signup successful! Welcome, ${formData.firstName}!`, "success");
      reset();
      setProfilePreview(null);
      setCoverPreview(null);
    } catch (err: unknown) {
      console.error("Error signing up:", err);
      if (err instanceof Error) showToast(err.message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 flex justify-center items-center flex-col">
      <div className="space-y-4">
        {/* Name Fields */}
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
        </div>

        <div className="flex gap-10">
          <div>
            <Label name="profile" className="pl-3" label="Profile Photo" />
            <input type="file" accept="image/*" className="hidden" id="profileUpload" onChange={(e) => handleFileChange(e, "profile")} />
            <label htmlFor="profileUpload" className="cursor-pointer flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <RiImageAddFill className="text-blue-500" />
              Upload Profile
            </label>
            {profilePreview && <img src={profilePreview} alt="Profile Preview" className="mt-2 w-24 h-24 rounded-full border" />}
          </div>

          <div>
            <Label name="cover" className="pl-3" label="Cover Photo" />
            <input type="file" accept="image/*" className="hidden" id="coverUpload" onChange={(e) => handleFileChange(e, "cover")} />
            <label htmlFor="coverUpload" className="cursor-pointer flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <RiImageAddFill className="text-blue-500" />
              Upload Cover
            </label>
            {coverPreview && <img src={coverPreview} alt="Cover Preview" className="mt-2 w-48 h-24 rounded-lg border" />}
          </div>
        </div>

        <div className="flex gap-10">
          <div>
            <Label name="gender" className="pl-3" label={authLabel.gender[lang]} />
            <select {...register("gender", { required: true })} className="block w-[16rem] pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
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
        <Button buttonText={authLabel.signup[lang]} type="submit" />
      </div>
    </form>
  );
};

export default RegisterForm;
