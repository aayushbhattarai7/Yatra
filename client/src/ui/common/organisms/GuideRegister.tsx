import { useForm, SubmitHandler } from "react-hook-form";
import Label from "../atoms/Label";
import axios from "axios";
import InputField from "../../common/atoms/InputField";
import Button from "../../common/atoms/Button";
import { useMessage } from "../../../contexts/MessageContext";
import { useState } from "react";
import OTP from "../../../components/Otp";
import { gql } from "@apollo/client";

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
  voterCard: FileList;
  passport: FileList;
  gender: string;
  DOB: string;
  nationality: string;
  province: string;
  district: string;
  licenseNumber: string;
  licenseValidityFrom: string;
  licenseValidityTo: string;
  municipality: string;
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

const GuideRegister: React.FC = () => {
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
      formData.append("licenseNumber", basicInfo.licenseNumber);
      formData.append("licenseValidityFrom", basicInfo.licenseValidityFrom);
      formData.append("licenseValidityTo", basicInfo.licenseValidityTo);

      formData.append("province", basicInfo.province);
      formData.append("district", basicInfo.district);
      formData.append("municipality", basicInfo.municipality);
      formData.append("passPhoto", data.passPhoto[0]);
      formData.append("type", "PROFILE");
      formData.append("license", data.license[0]);
      console.log("akjsj");
      if (identityType === "citizenship") {
        formData.append("citizenshipId", data.citizenshipId);
        formData.append("citizenshipIssueDate", data.citizenshipIssueDate);
        formData.append("citizenshipIssueFrom", data.citizenshipIssueFrom);
        formData.append("citizenshipFront", data.citizenshipFront[0]);
        formData.append("citizenshipBack", data.citizenshipBack[0]);
        formData.append("kycType", "CITIZENSHIP");
      } else if (identityType === "passport") {
        formData.append("passportId", data.passportId);
        formData.append("passportIssueDate", data.passportIssueDate);
        formData.append("passportExpiryDate", data.passportExpiryDate);
        formData.append("passportIssueFrom", data.passportIssueFrom);
        formData.append("passport", data.passport[0]);
        formData.append("kycType", "PASSPORT");
      } else if (identityType === "voterCard") {
        formData.append("voterId", data.voterId);
        formData.append("voterAddress", data.voterAddress);
        formData.append("voterCard", data.voterCard[0]);
        formData.append("kycType", "VOTERCARD");
      }
      setEmail(basicInfo.email);
      const response = gql`
        mutation guideSignup($data: GuideDTO!, $files: [Upload!]!) {
          guideSignup(data: $data, files: $files) {
            data
            files
          }
        }
      `;
      console.log(response, "ka");
      setMessage("Success", "success");
      setRegistered(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
    <div>
      <form
        onSubmit={handleSubmit(
          showIdentityFields ? onSubmitIdentity : onSubmitBasicInfo
        )}
        noValidate
        encType="multipart/form-data"
        className="flex flex-col justify-center items-center"
      >
        {!showIdentityFields ? (
          <div>
            <div className="mb-4">
              <Label name="firstName" label="First Name" required />
              <InputField
                type="text"
                name="firstName"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="middleName" label="Middle Name" />
              <InputField
                type="text"
                name="middleName"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="lastName" label="Last Name" required />
              <InputField
                type="text"
                name="lastName"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="email" label="Email" required />
              <InputField
                type="email"
                name="email"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="phoneNumber" label="Phone Number" required />
              <InputField
                type="tel"
                name="phoneNumber"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="gender" label="Gender" required />
              <select {...register("gender", { required: true })}>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div className="mb-4">
              <Label name="password" label="Password" required />
              <InputField
                type="password"
                name="password"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="DOB" label="Date Of Birth" required />
              <InputField
                type="date"
                name="DOB"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="nationality" label="Nationality" required />
              <InputField
                type="text"
                name="nationality"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="province" label="Province" required />
              <InputField
                type="text"
                name="province"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="district" label="District" required />
              <InputField
                type="text"
                name="district"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="municipality" label="Municipality" required />
              <InputField
                type="text"
                name="municipality"
                register={register}
                className={""}
              />
            </div>

            <div className="mb-4">
              <Label name="licenseNumber" label="licenseNumber" required />
              <InputField
                type="text"
                name="licenseNumber"
                register={register}
                className={""}
              />
            </div>

            <div className="mb-4">
              <Label
                name="licenseValidityFrom"
                label="licenseValidityFrom"
                required
              />
              <InputField
                type="date"
                name="licenseValidityFrom"
                register={register}
                className={""}
              />
            </div>

            <div className="mb-4">
              <Label
                name="licenseValidityTo"
                label="licenseValidityTo"
                required
              />
              <InputField
                type="date"
                name="licenseValidityTo"
                register={register}
                className={""}
              />
            </div>
            <div className="mb-4">
              <Label name="identityType" label="Identity Type" required />
              <select
                value={identityType}
                onChange={handleIdentityChange}
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
              name={""}
              buttonText={"next"}
              className={""}
            />
          </div>
        ) : (
          <>
            {identityType === "citizenship" && (
              <>
                <div className="mb-4">
                  <Label name="citizenshipId" label="Citizenship ID" required />
                  <InputField
                    type="text"
                    name="citizenshipId"
                    register={register}
                    className={""}
                  />
                </div>
                <div className="mb-4">
                  <Label
                    name="citizenshipIssueDate"
                    label="Issue Date"
                    required
                  />
                  <InputField
                    type="date"
                    name="citizenshipIssueDate"
                    register={register}
                    className={""}
                  />
                </div>
                <div className="mb-4">
                  <Label
                    name="citizenshipIssueFrom"
                    label="Issued From"
                    required
                  />
                  <InputField
                    type="text"
                    name="citizenshipIssueFrom"
                    register={register}
                    className={""}
                  />
                </div>
                <div className="mb-4">
                  <Label name="citizenshipFront" label={"citizenshipFront"} />
                  <input
                    type="file"
                    {...register("citizenshipFront")}
                    className=""
                  />
                </div>
                <div className="mb-4">
                  <Label name="citizenshipBack" label={"citizenshipBack"} />
                  <input
                    type="file"
                    {...register("citizenshipBack")}
                    className=""
                  />
                </div>
              </>
            )}

            {identityType === "passport" && (
              <>
                <div className="mb-4">
                  <Label name="passportId" label="Passport ID" required />
                  <InputField
                    type="text"
                    name="passportId"
                    register={register}
                    className={""}
                  />
                </div>
                <div className="mb-4">
                  <Label name="passportIssueDate" label="Issue Date" required />
                  <InputField
                    type="date"
                    name="passportIssueDate"
                    register={register}
                    className={""}
                  />
                </div>
                <div className="mb-4">
                  <Label
                    name="passportExpiryDate"
                    label="Expiry Date"
                    required
                  />
                  <InputField
                    type="date"
                    name="passportExpiryDate"
                    register={register}
                    className={""}
                  />
                </div>
                <div className="mb-4">
                  <Label
                    name="passportIssueFrom"
                    label="Issued From"
                    required
                  />
                  <InputField
                    type="text"
                    name="passportIssueFrom"
                    register={register}
                    className={""}
                  />
                </div>
                <div className="mb-4">
                  <Label name="passport" label={"passport"} />
                  <input type="file" {...register("passport")} className="" />
                </div>
              </>
            )}

            {identityType === "voterCard" && (
              <>
                <div className="mb-4">
                  <Label name="voterId" label="Voter ID" required />
                  <InputField
                    type="text"
                    name="voterId"
                    register={register}
                    className={""}
                  />
                </div>
                <div className="mb-4">
                  <Label name="voterAddress" label="Voter Address" required />
                  <InputField
                    type="text"
                    name="voterAddress"
                    register={register}
                    className={""}
                  />
                </div>
                <div className="mb-4">
                  <Label name="voterCard" label={"voterCard"} />
                  <input type="file" {...register("voterCard")} className="" />
                </div>
              </>
            )}
            <div className="mb-4">
              <Label name="passPhoto" label={"passPhoto"} />
              <input type="file" {...register("passPhoto")} className="" />
            </div>
            <div className="mb-4">
              <Label name="license" label={"license"} />
              <input type="file" {...register("license")} className="" />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              name={""}
              buttonText={"submit"}
              className={""}
            />
          </>
        )}
      </form>
      {registered && <OTP email={email} />}
    </div>
  );
};

export default GuideRegister;
