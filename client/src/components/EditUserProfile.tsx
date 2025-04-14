import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";
import { motion } from "framer-motion";
import { User, X } from "lucide-react";

interface EditProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  travelStyle: string;
}

interface EditProfilePopupProps {
  editProfileData: EditProfileData;
  setEditProfileData: (data: EditProfileData) => void;
  handleEditProfileSubmit: () => Promise<void>;
  onClose: () => void;
}

const EditProfilePopup = ({
  editProfileData,
  setEditProfileData,
  handleEditProfileSubmit,
  onClose,
}: EditProfilePopupProps) => {
  const { lang } = useLang()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            {authLabel.editProfileTitle[lang]}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {authLabel.firstName[lang]}
              </label>
              <input
                type="text"
                value={editProfileData.firstName}
                onChange={(e) =>
                  setEditProfileData({ ...editProfileData, firstName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {authLabel.middleName[lang]}
              </label>
              <input
                type="text"
                value={editProfileData.middleName}
                onChange={(e) =>
                  setEditProfileData({ ...editProfileData, middleName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {authLabel.lastName[lang]}
            </label>
            <input
              type="text"
              value={editProfileData.lastName}
              onChange={(e) =>
                setEditProfileData({ ...editProfileData, lastName: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {authLabel.phoneNumber[lang]}
            </label>
            <input
              type="tel"
              value={editProfileData.phoneNumber}
              onChange={(e) =>
                setEditProfileData({ ...editProfileData, phoneNumber: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {authLabel.gender[lang]}
            </label>
            <select
              value={editProfileData.gender}
              onChange={(e) =>
                setEditProfileData({ ...editProfileData, gender: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">{authLabel.gender[lang]}</option>
              <option value="MALE">{authLabel.male[lang]}</option>
              <option value="FEMALE">{authLabel.female[lang]}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {authLabel.travelStyle[lang]}
            </label>
            <select
              value={editProfileData.travelStyle}
              onChange={(e) =>
                setEditProfileData({ ...editProfileData, travelStyle: e.target.value })
              } className="block w-[16rem] pl-3 pr-3 py-2 border border-gray-300 bg-white text-black rounded-lg"
            >
              <option value="Nature Explorer">{authLabel.natureExplorer[lang]}</option>
              <option value="Adventure Seeker">{authLabel.adventureSeeker[lang]}</option>
              <option value="Cultural Enthusiast">{authLabel.culturalEnthusiast[lang]}</option>
              <option value="Luxury Traveler">{authLabel.luxuryTraveler[lang]}</option>
              <option value="Budget Backpacker">{authLabel.budgetBackpacker[lang]}</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {authLabel.cancel[lang]}
            </button>
            <button
              onClick={handleEditProfileSubmit}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {authLabel.saveChanges[lang]}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditProfilePopup;
