import React, { useState } from "react";
import axiosInstance from "../../service/axiosInstance";
import { useForm, SubmitHandler } from "react-hook-form";
import Label from "../common/atoms/Label";
import axios from "axios";
import InputField from "../common/atoms/InputField";
import Button from "../common/atoms/Button";
import { useMessage } from "../../contexts/MessageContext";
import OTP from "../../components/Otp";
import { MapPin } from "lucide-react";

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passPhoto: FileList;
  citizenshipFront: FileList;
  citizenshipBack: FileList;
  license: FileList;
  vehicleRegistration: FileList;
  voterCard: FileList;
  passport: FileList;
  gender: string;
  DOB: string;
  nationality: string;
  province: string;
  district: string;
  municipality: string;
  engineNumber: string;
  chasisNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  citizenshipId: string;
  citizenshipIssueDate: string;
  citizenshipIssueFrom: string;
  passportId: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssueFrom: string;
  voterId: string;
  voterAddress: string;
}

const TravelRegister: React.FC = () => {
  const { setMessage } = useMessage();
  const [registered, setRegistered] = useState<boolean>(false);
  const [showIdentityFields, setShowIdentityFields] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [identityType, setIdentityType] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const handleIdentityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIdentityType(event.target.value);
  };

  const onSubmitBasicInfo: SubmitHandler<FormData> = (data) => {
    localStorage.setItem("basicInfo", JSON.stringify(data));

    setShowIdentityFields(true);
  };

  const onSubmitIdentity: SubmitHandler<FormData> = async (data) => {
    try {
      const basicInfo = JSON.parse(localStorage.getItem("basicInfo") || "{}");
      console.log(
        "🚀 ~ constonSubmitIdentity:SubmitHandler<FormData>= ~ basicInfo:",
        basicInfo
      );

      const formData = new FormData();
      formData.append("firstName", basicInfo.firstName);
      if (basicInfo.middleName)
        formData.append("middleName", basicInfo.middleName);
      formData.append("lastName", basicInfo.lastName);
      formData.append("email", basicInfo.email);
      formData.append("phoneNumber", basicInfo.phoneNumber);
      formData.append("gender", basicInfo.gender);
      formData.append("password", basicInfo.password);
      formData.append("DOB", basicInfo.DOB);
      formData.append("nationality", basicInfo.nationality);
      formData.append("province", basicInfo.province);
      formData.append("district", basicInfo.district);
      formData.append("municipality", basicInfo.municipality);
      formData.append("engineNumber", basicInfo.engineNumber);
      formData.append("chasisNumber", basicInfo.chasisNumber);
      formData.append("vehicleNumber", basicInfo.vehicleNumber);
      formData.append("vehicleType", basicInfo.vehicleType);
      formData.append("passPhoto", data.passPhoto[0]);
      formData.append("type", "PROFILE");
      formData.append("vehicleRegistration", data.vehicleRegistration[0]);
      if (identityType === "citizenship") {
        formData.append("kycType", "CITIZENSHIP");
        formData.append("citizenshipId", data.citizenshipId);
        formData.append("citizenshipIssueDate", data.citizenshipIssueDate);
        formData.append("citizenshipIssueFrom", data.citizenshipIssueFrom);
        formData.append("citizenshipFront", data.citizenshipFront[0]);
        formData.append("citizenshipBack", data.citizenshipBack[0]);
        console.log(data.citizenshipBack[0]);
      } else if (identityType === "passport") {
        formData.append("passportId", data.passportId);
        formData.append("passportIssueDate", data.passportIssueDate);
        formData.append("passportExpiryDate", data.passportExpiryDate);
        formData.append("passportIssueFrom", data.passportIssueFrom);
        formData.append("passport", data.passport[0]);
        formData.append("kycType", "PASSPORT");

        console.log(data.passport[0]);
      } else if (identityType === "voterCard") {
        formData.append("kycType", "VOTERCARD");
        formData.append("voterId", data.voterId);
        formData.append("voterAddress", data.voterAddress);
        formData.append("voterCard", data.voterCard[0]);
      }
      setEmail(basicInfo.email);
      console.log("basicInfo from localStorage:", data);

      console.log(formData, "hhhhha");
      const response = await axiosInstance.post("/travel/signup", formData);
      console.log(response, "ka");
      setMessage(response.data.message, "success");
      setRegistered(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error, "------");
        setMessage(
          error.response?.data?.message || "An error occurred",
          "error"
        );
      } else {
        console.log(error);
        setMessage("Required fields should not be empty", "error");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 min-h-screen overflow-y-auto px-8 py-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Yatra</h1>
            <p className="text-gray-600">
              Travel is the only purchase that enriches you in ways beyond
              material wealth.
            </p>
          </div>

          <div className="step-indicator">
            <div
              className={`step ${
                !showIdentityFields ? "step-active" : "step-inactive"
              }`}
            />
            <div
              className={`step ${
                showIdentityFields && !registered
                  ? "step-active"
                  : "step-inactive"
              }`}
            />
            <div
              className={`step ${registered ? "step-active" : "step-inactive"}`}
            />
          </div>
          <form
            onSubmit={handleSubmit(
              showIdentityFields ? onSubmitIdentity : onSubmitBasicInfo
            )}
            noValidate
            encType="multipart/form-data"
            className="space-y-6"
          >
            {!showIdentityFields ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Basic Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label name="firstName" label="First Name" required />
                    <InputField
                      type="text"
                      name="firstName"
                      register={register}
                      className="form-input"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label name="middleName" label="Middle Name" />
                    <InputField
                      type="text"
                      name="middleName"
                      register={register}
                      className="form-input"
                      placeholder="David"
                    />
                  </div>
                </div>

                <div>
                  <Label name="lastName" label="Last Name" required />
                  <InputField
                    type="text"
                    name="lastName"
                    register={register}
                    className="form-input"
                    placeholder="Smith"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label name="email" label="Email" required />
                    <InputField
                      type="email"
                      name="email"
                      register={register}
                      className="form-input"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label name="phoneNumber" label="Phone Number" required />
                    <InputField
                      type="tel"
                      name="phoneNumber"
                      register={register}
                      className="form-input"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label name="gender" label="Gender" required />
                    <select
                      {...register("gender", { required: true })}
                      className="form-select"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  <div>
                    <Label name="password" label="Password" required />
                    <InputField
                      type="password"
                      name="password"
                      register={register}
                      className="form-input"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <Label name="DOB" label="Date Of Birth" required />
                  <InputField
                    type="date"
                    name="DOB"
                    register={register}
                    className="form-input"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label name="nationality" label="Nationality" required />
                      <InputField
                        type="text"
                        name="nationality"
                        register={register}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label name="province" label="Province" required />
                      <InputField
                        type="text"
                        name="province"
                        register={register}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label name="district" label="District" required />
                      <InputField
                        type="text"
                        name="district"
                        register={register}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label
                        name="municipality"
                        label="Municipality"
                        required
                      />
                      <InputField
                        type="text"
                        name="municipality"
                        register={register}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Vehicle Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        name="engineNumber"
                        label="Engine Number"
                        required
                      />
                      <InputField
                        type="text"
                        name="engineNumber"
                        register={register}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label
                        name="chasisNumber"
                        label="Chassis Number"
                        required
                      />
                      <InputField
                        type="text"
                        name="chasisNumber"
                        register={register}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        name="vehicleNumber"
                        label="Vehicle Number"
                        required
                      />
                      <InputField
                        type="text"
                        name="vehicleNumber"
                        register={register}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label name="vehicleType" label="Vehicle Type" required />
                      <InputField
                        type="text"
                        name="vehicleType"
                        register={register}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label name="identityType" label="Identity Type" required />
                  <select
                    value={identityType}
                    onChange={handleIdentityChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Identity Type</option>
                    <option value="citizenship">Citizenship</option>
                    <option value="passport">Passport</option>
                    <option value="voterCard">Voter Card</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  name=""
                  buttonText="Continue to Documents"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Document Upload
                </h2>

                {identityType === "citizenship" && (
                  <div className="space-y-4">
                    <div>
                      <Label
                        name="citizenshipId"
                        label="Citizenship ID"
                        required
                      />
                      <InputField
                        type="text"
                        name="citizenshipId"
                        register={register}
                        className="form-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          name="citizenshipIssueDate"
                          label="Issue Date"
                          required
                        />
                        <InputField
                          type="date"
                          name="citizenshipIssueDate"
                          register={register}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <Label
                          name="citizenshipIssueFrom"
                          label="Issued From"
                          required
                        />
                        <InputField
                          type="text"
                          name="citizenshipIssueFrom"
                          register={register}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          name="citizenshipFront"
                          label="Citizenship Front"
                        />
                        <input
                          type="file"
                          {...register("citizenshipFront")}
                          className="file-input"
                        />
                      </div>
                      <div>
                        <Label
                          name="citizenshipBack"
                          label="Citizenship Back"
                        />
                        <input
                          type="file"
                          {...register("citizenshipBack")}
                          className="file-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {identityType === "passport" && (
                  <div className="space-y-4">
                    <div>
                      <Label name="passportId" label="Passport ID" required />
                      <InputField
                        type="text"
                        name="passportId"
                        register={register}
                        className="form-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          name="passportIssueDate"
                          label="Issue Date"
                          required
                        />
                        <InputField
                          type="date"
                          name="passportIssueDate"
                          register={register}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <Label
                          name="passportExpiryDate"
                          label="Expiry Date"
                          required
                        />
                        <InputField
                          type="date"
                          name="passportExpiryDate"
                          register={register}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        name="passportIssueFrom"
                        label="Issued From"
                        required
                      />
                      <InputField
                        type="text"
                        name="passportIssueFrom"
                        register={register}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label name="passport" label="Passport Document" />
                      <input
                        type="file"
                        {...register("passport")}
                        className="file-input"
                      />
                    </div>
                  </div>
                )}

                {identityType === "voterCard" && (
                  <div className="space-y-4">
                    <div>
                      <Label name="voterId" label="Voter ID" required />
                      <InputField
                        type="text"
                        name="voterId"
                        register={register}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label
                        name="voterAddress"
                        label="Voter Address"
                        required
                      />
                      <InputField
                        type="text"
                        name="voterAddress"
                        register={register}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label name="voterCard" label="Voter Card Document" />
                      <input
                        type="file"
                        {...register("voterCard")}
                        className="file-input"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label name="passPhoto" label="Passport Size Photo" />
                    <input
                      type="file"
                      {...register("passPhoto")}
                      className="file-input"
                    />
                  </div>
                  <div>
                    <Label
                      name="vehicleRegistration"
                      label="Vehicle Registration"
                    />
                    <input
                      type="file"
                      {...register("vehicleRegistration")}
                      className="file-input"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  name=""
                  buttonText="Complete Registration"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                />
              </div>
            )}
          </form>

          {registered && (
            <div className="mt-8">
              <OTP email={email} registerType="travel"/>
            </div>
          )}
        </div>
      </div>

      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        }}
      >
        <div className="h-full w-full bg-black bg-opacity-30 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4">Yatra</h2>
            <p className="text-xl">
              Travel is the only purchase that enriches you in ways beyond
              material wealth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelRegister;
