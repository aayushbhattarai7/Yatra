import { SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/ui/common/atoms/InputField";
import { authLabel } from "@/localization/auth";
import { useLang } from "@/hooks/useLang";
import Label from "@/ui/common/atoms/Label";
import { RxPerson } from "react-icons/rx";
import Button from "@/ui/common/atoms/Button";
import { TRAVEL_BOOKING_MUTATION } from "@/mutation/queries";
import { useMutation } from "@apollo/client";
import { showToast } from "./ToastNotification";
import { X } from "lucide-react";

interface RequestProps {
  id: string;
  onClose: () => void;
}

interface FormData {
  id: string;
  totalPeople: string;
  totalDays: string;
  to: string;
  from: string;
}

const RequestTravelBooking = ({ id, onClose }: RequestProps) => {
  const { lang } = useLang();
  const { register, setValue, control, handleSubmit } = useForm<FormData>();
  const [requestTravel, { loading }] = useMutation(
    TRAVEL_BOOKING_MUTATION
  );

  const submit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await requestTravel({
        variables: {
          from: formData.from,
          to: formData.to,
          travelId: id,
          totalPeople: formData.totalPeople,
          totalDays: formData.totalDays,
        },
      });

      showToast(response.data.requestTravel, "success");
      onClose();
    } catch (err: unknown) {
      console.log(err, "ahah");
      if (err instanceof Error) {
        showToast(err.message, "error");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl transition-colors"
          aria-label="Close"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {authLabel.book[lang]}
        </h2>

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          {["from", "to", "totalPeople", "totalDays"].map(
            (field) => (
              <div key={field}>
                <Label name={field} label={authLabel[field][lang]} required />
                <InputField
                  control={control}
                  setValue={setValue}
                  placeholder={authLabel[field][lang]}
                  type="text"
                  name={field}
                  register={register}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  icon={<RxPerson />}
                />
              </div>
            )
          )}

          <div className="flex justify-center mt-6">
            <Button
              buttonText={
                loading ? `${authLabel.book[lang]}...` : authLabel.book[lang]
              }
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestTravelBooking;
