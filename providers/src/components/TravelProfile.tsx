import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Mail, Phone,  Calendar, Settings, Camera, Upload, X, Mountain, Compass, ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { LogoutPopup } from './LogoutPopup';
import { CHANGE_EMAIL_OF_TRAVEL, GET_TRAVEL_PROFILE, VERIFY_EMAIL_OF_TRAVEL } from "../mutation/queries";
import { useMutation, useQuery } from '@apollo/client';
import { authLabel } from '../localization/auth';
import { useLang } from '../hooks/useLang';
import { showToast } from './ToastNotification';
import { useNavigate } from 'react-router-dom';
import EditProfilePopup from './EditProgilrPopup';
import axiosInstance from '../service/axiosInstance';

interface UserData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  vehicleType:string;
  createdAt: string;
  kyc: KYC[];
}
interface KYC {
  id: string;
  fileType: string;
  path: string;
}

interface EditProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
}


function App() {
  const [logout, setLogout] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<"profile" | "cover">("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [otp, setOtp] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState<EditProfileData>({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
  });
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const { data, refetch } = useQuery(GET_TRAVEL_PROFILE);
  console.log("🚀 ~ App ~ data:", data)
  const { lang } = useLang()
  const navigate = useNavigate()
   const [changeEmailOfTravel] = useMutation(CHANGE_EMAIL_OF_TRAVEL);
    const [verifyEmailWhileChangeOfTravel] = useMutation(VERIFY_EMAIL_OF_TRAVEL);
  useEffect(() => {
    if (data?.getTravelDetails) {
      setUser(data.getTravelDetails);
    }
  }, [data]);
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailChange = async () => {
    try {
      await changeEmailOfTravel({ variables: { email: newEmail } });
      setShowOtpPopup(true);
    } catch (err: unknown) {
      if (err instanceof Error) showToast(err.message, "error");
      console.error("Failed to change email:", err);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyEmailWhileChangeOfTravel({
        variables: { email: newEmail, otp },
      });
      refetch();
      setIsEditingEmail(false);
      setShowOtpPopup(false);
    } catch (err: unknown) {
      if (err instanceof Error) showToast(err.message, "error");
      console.error("Failed to verify OTP:", err);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    try {
      const formData = new FormData();
      formData.append(uploadType, selectedImage);
      formData.append("type", uploadType.toUpperCase());
      await axiosInstance.patch("/travel/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refetch();
      setShowImageUpload(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      showToast("Image updated successfully", "success");
    } catch (err: unknown) {
      if (err instanceof Error) showToast(err.message, "error");
      console.error("Failed to upload image:", err);
    }
  };
  const openEditProfile = () => {
    if (user) {
      setEditProfileData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        phoneNumber: user.phoneNumber || "",
      });
      setShowEditProfile(true);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {logout && <LogoutPopup onClose={() => setLogout(false)} type="travel" />}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <div className="h-[300px] rounded-3xl overflow-hidden relative mb-8">
            {user?.kyc && (
              <div>
                {user?.kyc?.map((image) => (
                  <div key={image.id}>
                    {image.fileType === "LICENSE" && (
                      <img src={image.path} alt="Cover" className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <button
              onClick={() => {
                setUploadType("cover");
                setShowImageUpload(true);
              }}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all"
            >
              <Camera className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-end gap-6 flex-wrap">
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  {user?.kyc.map((image) => (
                    <div key={image.id}>
                      {image.fileType === "PASSPHOTO" && (
                        <img
                          src={image.path}
                          alt="Profile"
                          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-lg"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setUploadType("profile");
                      setShowImageUpload(true);
                    }}
                    className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition-all"
                  >
                    <Camera className="w-4 h-4 text-gray-700" />
                  </button>
                </motion.div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {user?.firstName} {user?.middleName} {user?.lastName}
                  </h1>

                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-end">
                    <button
                      onClick={openEditProfile}
                      className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> {authLabel.editProfileTitle[lang]}
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-emerald-600" /> {authLabel.explorerDetails[lang]}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">{authLabel.email[lang]}</div>
                        {!isEditingEmail && (
                          <button className="text-sm text-emerald-600 hover:underline" onClick={() => setIsEditingEmail(true)}>
                            {authLabel.change[lang]}
                          </button>
                        )}
                      </div>
                      <div className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-emerald-600" />
                        {!isEditingEmail ? (
                          user?.email
                        ) : (
                          <div className="flex gap-2 w-full">
                            <input
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              placeholder="Enter new email"
                              className="border border-gray-300 rounded-lg px-3 py-1 w-full text-sm"
                            />
                            <button
                              onClick={handleEmailChange}
                              className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-700 transition-all"
                            >
                              {authLabel.submit[lang]}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-500">{authLabel.phoneNumber[lang]}</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        {user?.phoneNumber}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-500">{authLabel.memberSince[lang]}</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-500">{authLabel.vehicleType[lang]}</div>
                        <div>{user?.vehicleType}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-600" /> {authLabel.quickActions[lang]}
                  </h2>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <div onClick={() => navigate("/settings")} className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-emerald-600" />
                        <span>{authLabel.accountSettings[lang]}</span>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setLogout(true)}
                      className="w-full flex items-center justify-between p-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" />
                        <span>{authLabel.endJourney[lang]}</span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {showImageUpload && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={() => setShowImageUpload(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl p-6 w-full max-w-lg"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {uploadType === "profile" ? `${authLabel.profilePhoto[lang]}` : `${authLabel.coverPhoto[lang]}`}
                    </h3>
                    <button onClick={() => setShowImageUpload(false)} className="text-gray-500 hover:text-gray-700">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className={`w-full rounded-xl ${uploadType === "profile" ? "h-64 object-cover" : "h-40 object-cover"
                            }`}
                        />
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-lg hover:bg-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                      >
                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-2">`${authLabel.clickToUpload[lang]}`</p>
                        <p className="text-xs text-gray-500">`${authLabel.supportedFormats[lang]}`</p>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowImageUpload(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {authLabel.cancel[lang]}
                      </button>
                      <button
                        onClick={handleImageUpload}
                        disabled={!selectedImage}
                        className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors flex items-center justify-center gap-2 ${selectedImage ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed"
                          }`}
                      >
                        <Upload className="w-4 h-4" />
                        {authLabel.uploadPhoto[lang]}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {showOtpPopup && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Verify OTP</h2>
                <p className="text-sm text-gray-500">
                  Enter the OTP sent to <span className="font-medium">{newEmail}</span>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setShowOtpPopup(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Cancel
                  </button>
                  <button onClick={handleVerifyOtp} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                    Verify
                  </button>
                </div>
              </div>
            </div>
          )}
          {showEditProfile && (
             <EditProfilePopup
               editProfileData={editProfileData}
               setEditProfileData={setEditProfileData}
               type='travel'
               handleEditProfileSubmit={async () => {
                try {
                  const payload = {
                    ...editProfileData,
                    gender: editProfileData.gender.toUpperCase(), 
                  };
              
                  await axiosInstance.patch("/travel/update-profile",payload);
              
                  await refetch();
                  setShowEditProfile(false);
                  showToast("Profile updated successfully", "success");
                } catch (err: unknown) {
                  if (err instanceof Error) showToast(err.message, "error");
                  console.error("Failed to update profile:", err);
                }
              }}
               onClose={() => setShowEditProfile(false)}
             />
           )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;