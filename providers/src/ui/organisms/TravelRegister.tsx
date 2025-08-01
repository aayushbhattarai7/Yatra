import React, { useEffect, useState } from "react";
import axiosInstance from "../../service/axiosInstance";
import { useForm, SubmitHandler } from "react-hook-form";
import Label from "../common/atoms/Label";
import axios from "axios";
import InputField from "../common/atoms/InputField";
import Button from "../common/atoms/Button";
import { useMessage } from "../../contexts/MessageContext";
import OTP from "../../components/Otp";
import { MapPin, ArrowLeft } from "lucide-react";

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
  latitude: number;
  longitude: number;
}

const TravelRegister: React.FC = () => {
  const { setMessage } = useMessage();
  const [registered, setRegistered] = useState<boolean>(false);
  const [showIdentityFields, setShowIdentityFields] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [identityType, setIdentityType] = useState<string>("");
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const handleIdentityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setIdentityType(event.target.value);
  };

  const handleBack = () => {
    const savedData = JSON.parse(localStorage.getItem("basicInfo") || "{}");
    reset(savedData);
    setShowIdentityFields(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        localStorage.setItem("latitude", latitude.toString());
        localStorage.setItem("longitude", longitude.toString());
      });
    }
  }, []);

  useEffect(() => {}, [location]);
  const onSubmitBasicInfo: SubmitHandler<FormData> = (data) => {
    if (!identityType) {
      setMessage("Please select an identity type", "error");
      return;
    }
    console.log(data);
    localStorage.setItem("basicInfo", JSON.stringify(data));
    setShowIdentityFields(true);
  };

  const onSubmitIdentity: SubmitHandler<FormData> = async (data) => {
    try {
      const basicInfo = JSON.parse(localStorage.getItem("basicInfo") || "{}");
      const latitude = localStorage.getItem("latitude");
      const longitude = localStorage.getItem("longitude");
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
      formData.append("latitude", latitude!);
      formData.append("longitude", longitude!);
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
      if(registered){
        localStorage.removeItem("basicInfo")
        localStorage.removeItem("latitude")
        localStorage.removeItem("longitude")
      } 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error, "------");
        setMessage(
          error.response?.data?.message || "An error occurred",
          "error",
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

          <div className="step-indicator mb-8">
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

          {showIdentityFields && !registered && (
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Basic Information
            </button>
          )}

          <form
            onSubmit={handleSubmit(
              showIdentityFields ? onSubmitIdentity : onSubmitBasicInfo,
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
                    control={control}
                    setValue={setValue}
                      type="text"
                      name="firstName"
                      register={register}
                      className={`form-input ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                      placeholder="First Name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label name="middleName" label="Middle Name" />
                    <InputField
                    control={control}
                    setValue={setValue}
                      type="text"
                      name="middleName"
                      register={register}
                      className="form-input"
                      placeholder="Middle Name"
                    />
                  </div>
                </div>

                <div>
                  <Label name="lastName" label="Last Name" required />
                  <InputField
                  control={control}
                  setValue={setValue}
                    type="text"
                    name="lastName"
                    register={register}
                    className={`form-input ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label name="email" label="Email" required />
                    <InputField
                    control={control}
                    setValue={setValue}
                      type="email"
                      name="email"
                      register={register}
                      className={`form-input ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label name="phoneNumber" label="Phone Number" required />
                    <InputField
                    control={control}
                    setValue={setValue}
                      type="tel"
                      name="phoneNumber"
                      register={register}
                      className={`form-input ${
                        errors.phoneNumber ? "border-red-500" : ""
                      }`}
                      placeholder="+1234567890"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label name="gender" label="Gender" required />
                    <select
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className={`form-select ${
                        errors.gender ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label name="password" label="Password" required />
                    <InputField
                    control={control}
                    setValue={setValue}
                      type="password"
                      name="password"
                      register={register}
                      className={`form-input ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      placeholder="password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label name="DOB" label="Date Of Birth" required />
                  <InputField
                  control={control}
                  setValue={setValue}
                    type="date"
                    name="DOB"
                    register={register}
                    className={`form-input ${
                      errors.DOB ? "border-red-500" : ""
                    }`}
                  />
                  {errors.DOB && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.DOB.message}
                    </p>
                  )}
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
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="nationality"
                        register={register}
                        className={`form-input ${
                          errors.nationality ? "border-red-500" : ""
                        }`}
                      />
                      {errors.nationality && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.nationality.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label name="province" label="Province" required />
                      <InputField
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="province"
                        error={errors.province}
                        register={register}
                        className={`form-input ${
                          errors.province ? "border-red-500" : ""
                        }`}
                      />
                      {errors.province && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.province.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label name="district" label="District" required />
                      <InputField
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="district"
                        register={register}
                        className={`form-input ${
                          errors.district ? "border-red-500" : ""
                        }`}
                      />
                      {errors.district && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.district.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        name="municipality"
                        label="Municipality"
                        required
                      />
                      <InputField
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="municipality"
                        register={register}
                        className={`form-input ${
                          errors.municipality ? "border-red-500" : ""
                        }`}
                      />
                      {errors.municipality && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.municipality.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

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
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="engineNumber"
                        register={register}
                        className={`form-input ${
                          errors.engineNumber ? "border-red-500" : ""
                        }`}
                      />
                      {errors.engineNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.engineNumber.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        name="chasisNumber"
                        label="Chassis Number"
                        required
                      />
                      <InputField
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="chasisNumber"
                        register={register}
                        className={`form-input ${
                          errors.chasisNumber ? "border-red-500" : ""
                        }`}
                      />
                      {errors.chasisNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.chasisNumber.message}
                        </p>
                      )}
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
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="vehicleNumber"
                        register={register}
                        className={`form-input ${
                          errors.vehicleNumber ? "border-red-500" : ""
                        }`}
                      />
                      {errors.vehicleNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.vehicleNumber.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label name="vehicleType" label="Vehicle Type" required />
                      <InputField
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="vehicleType"
                        register={register}
                        className={`form-input ${
                          errors.vehicleType ? "border-red-500" : ""
                        }`}
                      />
                      {errors.vehicleType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.vehicleType.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label name="identityType" label="Identity Type" required />
                  <select
                    value={identityType}
                    onChange={handleIdentityChange}
                    className={`form-select ${
                      !identityType ? "border-red-500" : ""
                    }`}
                    required
                  >
                    <option value="">Select Identity Type</option>
                    <option value="citizenship">Citizenship</option>
                    <option value="passport">Passport</option>
                    <option value="voterCard">Voter Card</option>
                  </select>
                  {!identityType && (
                    <p className="text-red-500 text-sm mt-1">
                      Identity type is required
                    </p>
                  )}
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
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="citizenshipId"
                        register={register}
                        className={`form-input ${
                          errors.citizenshipId ? "border-red-500" : ""
                        }`}
                      />
                      {errors.citizenshipId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.citizenshipId.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          name="citizenshipIssueDate"
                          label="Issue Date"
                          required
                        />
                        <InputField
                        control={control}
                        setValue={setValue}
                          type="date"
                          name="citizenshipIssueDate"
                          register={register}
                          className={`form-input ${
                            errors.citizenshipIssueDate ? "border-red-500" : ""
                          }`}
                        />
                        {errors.citizenshipIssueDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.citizenshipIssueDate.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          name="citizenshipIssueFrom"
                          label="Issued From"
                          required
                        />
                        <InputField
                        control={control}
                        setValue={setValue}
                          type="text"
                          name="citizenshipIssueFrom"
                          register={register}
                          className={`form-input ${
                            errors.citizenshipIssueFrom ? "border-red-500" : ""
                          }`}
                        />
                        {errors.citizenshipIssueFrom && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.citizenshipIssueFrom.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          name="citizenshipFront"
                          label="Citizenship Front"
                          required
                        />
                        <input
                          type="file"
                          {...register("citizenshipFront", {
                            required: "Front image is required",
                          })}
                          className={`file-input ${
                            errors.citizenshipFront ? "border-red-500" : ""
                          }`}
                        />
                        {errors.citizenshipFront && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.citizenshipFront.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          name="citizenshipBack"
                          label="Citizenship Back"
                          required
                        />
                        <input
                          type="file"
                          {...register("citizenshipBack", {
                            required: "Back image is required",
                          })}
                          className={`file-input ${
                            errors.citizenshipBack ? "border-red-500" : ""
                          }`}
                        />
                        {errors.citizenshipBack && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.citizenshipBack.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {identityType === "passport" && (
                  <div className="space-y-4">
                    <div>
                      <Label name="passportId" label="Passport ID" required />
                      <InputField
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="passportId"
                        register={register}
                        className={`form-input ${
                          errors.passportId ? "border-red-500" : ""
                        }`}
                      />
                      {errors.passportId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.passportId.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          name="passportIssueDate"
                          label="Issue Date"
                          required
                        />
                        <InputField
                        control={control}
                        setValue={setValue}
                          type="date"
                          name="passportIssueDate"
                          register={register}
                          className={`form-input ${
                            errors.passportIssueDate ? "border-red-500" : ""
                          }`}
                        />
                        {errors.passportIssueDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.passportIssueDate.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          name="passportExpiryDate"
                          label="Expiry Date"
                          required
                        />
                        <InputField
                        control={control}
                        setValue={setValue}
                          type="date"
                          name="passportExpiryDate"
                          register={register}
                          className={`form-input ${
                            errors.passportExpiryDate ? "border-red-500" : ""
                          }`}
                        />
                        {errors.passportExpiryDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.passportExpiryDate.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label
                        name="passportIssueFrom"
                        label="Issued From"
                        required
                      />
                      <InputField
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="passportIssueFrom"
                        register={register}
                        className={`form-input ${
                          errors.passportIssueFrom ? "border-red-500" : ""
                        }`}
                      />
                      {errors.passportIssueFrom && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.passportIssueFrom.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        name="passport"
                        label="Passport Document"
                        required
                      />
                      <input
                        type="file"
                        {...register("passport", {
                          required: "Passport document is required",
                        })}
                        className={`file-input ${
                          errors.passport ? "border-red-500" : ""
                        }`}
                      />
                      {errors.passport && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.passport.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {identityType === "voterCard" && (
                  <div className="space-y-4">
                    <div>
                      <Label name="voterId" label="Voter ID" required />
                      <InputField
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="voterId"
                        register={register}
                        className={`form-input ${
                          errors.voterId ? "border-red-500" : ""
                        }`}
                      />
                      {errors.voterId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.voterId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        name="voterAddress"
                        label="Voter Address"
                        required
                      />
                      <InputField
                      control={control}
                      setValue={setValue}
                        type="text"
                        name="voterAddress"
                        register={register}
                        className={`form-input ${
                          errors.voterAddress ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {errors.voterAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.voterAddress.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        name="voterCard"
                        label="Voter Card Document"
                        required
                      />
                      <input
                        type="file"
                        {...register("voterCard", {
                          required: "Voter card document is required",
                        })}
                        className={`file-input ${
                          errors.voterCard ? "border-red-500" : ""
                        }`}
                      />
                      {errors.voterCard && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.voterCard.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label
                      name="passPhoto"
                      label="Passport Size Photo"
                      required
                    />
                    <input
                      type="file"
                      {...register("passPhoto", {
                        required: "Passport size photo is required",
                      })}
                      className={`file-input ${
                        errors.passPhoto ? "border-red-500" : ""
                      }`}
                    />
                    {errors.passPhoto && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passPhoto.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      name="vehicleRegistration"
                      label="Vehicle Registration"
                      required
                    />
                    <input
                      type="file"
                      {...register("vehicleRegistration", {
                        required: "Vehicle registration is required",
                      })}
                      className={`file-input ${
                        errors.vehicleRegistration ? "border-red-500" : ""
                      }`}
                    />
                    {errors.vehicleRegistration && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.vehicleRegistration.message}
                      </p>
                    )}
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
              <OTP email={email} registerType="travel" onClose={()=>setRegistered(false)} />
            </div>
          )}
        </div>
      </div>

      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4. 3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
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
