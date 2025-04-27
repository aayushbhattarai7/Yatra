import { SubmitHandler, useForm } from "react-hook-form";
import { RiImageAddFill } from "react-icons/ri";
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
  travelStyle: string;
  gender: "MALE" | "FEMALE";
  profile?: File;
  cover?: File;
}

const RegisterForm = () => {
  const { lang } = useLang();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>();
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
      formDataToSend.append("travelStyle", formData.travelStyle);
      formDataToSend.append("gender", formData.gender);
      if (formData.profile) formDataToSend.append("profile", formData.profile);
      if (formData.cover) formDataToSend.append("cover", formData.cover);

      const response = await axiosInstance.post("/user/signup", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
        <div className="flex gap-10">
          <div>
            <Label name="firstName" className="pl-3" label={authLabel.firstName[lang]} required />
            <InputField
              setValue={setValue}
              placeholder={authLabel.firstName[lang]}
              type="text"
              register={register}
              required
              {...register("firstName", {
                required: "First name is required",
              })}
              rules={{
                required: "First name is required",
              }}
              error={errors.firstName}
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
            <Label name="lastName" className="pl-3" label={authLabel.lastName[lang]} required />
            <InputField
              setValue={setValue}
              placeholder={authLabel.lastName[lang]}
              type="text"
              register={register}
              required
              {...register("lastName", {
                required: "Last name is required",
              })}
              
              error={errors.lastName}
              className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"

            />

          </div>
          <div>
            <Label name="email" className="pl-3" label={authLabel.email[lang]} required />
            <InputField
              placeholder="Enter your email"
              type="email"
              register={register}
              error={errors.email}
              setValue={setValue}
              required
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}

              className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"

            />

          </div>

        </div>
        <div className="flex gap-10">
          <div>
            <Label name="phoneNumber" className="pl-3" label={authLabel.phoneNumber[lang]} required />
            <InputField
              setValue={setValue}
              placeholder={authLabel.phoneNumber[lang]}
              type="text"
              error={errors.phoneNumber}
              register={register}
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be exactly 10 digits",
                },
              })}
              className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              required
            />

          </div>
          <div>

            <Label name="password" className="pl-3" label={authLabel.password[lang]} required />
            <InputField
              setValue={setValue}
              error={errors.password}
              placeholder={authLabel.password[lang]}
              type="password"
              register={register}
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                  message: "Password must have uppercase, lowercase, number and special character",
                },
              })}
              className="block w-[16rem] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              required
            />
          </div>
        </div>

        <div className="flex gap-8">
          <div>
            <Label name="gender" className="pl-3" label={authLabel.gender[lang]} required />
            <select {...register("gender", { required: "Gender is required" })} required className="block w-[23rem] pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <option value="MALE">{authLabel.male[lang]}</option>
              <option value="FEMALE">{authLabel.female[lang]}</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}

          </div>
          <div>
            <Label name="travelStyle" className="pl-3"  label={authLabel.travelStyle[lang]} required />
            <select
              {...register("travelStyle", { required: "Travel style is required" })}
              className="block w-[23rem] pl-3 pr-3 py-2 border border-gray-300 bg-white text-black rounded-lg"
            >
              <option value="Nature Explorer">{authLabel.natureExplorer[lang]}</option>
              <option value="Adventure Seeker">{authLabel.adventureSeeker[lang]}</option>
              <option value="Cultural Enthusiast">{authLabel.culturalEnthusiast[lang]}</option>
              <option value="Luxury Traveler">{authLabel.luxuryTraveler[lang]}</option>
              <option value="Budget Backpacker">{authLabel.budgetBackpacker[lang]}</option>
            </select>
            {errors.travelStyle && <p className="text-red-500 text-sm mt-1">{errors.travelStyle.message}</p>}

          </div>
        </div>
        <div className="flex gap-60">
          <div>
            <Label name="profile" className="pl-3" label={authLabel.profilePhoto[lang]} />
            <input type="file" accept="image/*" className="hidden" id="profileUpload" onChange={(e) => handleFileChange(e, "profile")} />
            <label htmlFor="profileUpload" className="cursor-pointer flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <RiImageAddFill className="text-blue-500" />
              {authLabel.uploadProfile[lang]}
            </label>
            {profilePreview && <img src={profilePreview} alt="Profile Preview" className="mt-2 w-24 h-24 rounded-full border" />}
          </div>

          <div>
            <Label name="cover" className="pl-3" label={authLabel.coverPhoto[lang]} />
            <input type="file" accept="image/*" className="hidden" id="coverUpload" onChange={(e) => handleFileChange(e, "cover")} />
            <label htmlFor="coverUpload" className="cursor-pointer flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <RiImageAddFill className="text-blue-500" />
              {authLabel.uploadCover[lang]}
            </label>
            {coverPreview && <img src={coverPreview} alt="Cover Preview" className="mt-2 w-48 h-24 rounded-lg border" />}
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
