import { SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/ui/common/atoms/InputField";
import { authLabel } from "@/localization/auth";
import { useLang } from "@/hooks/useLang";
import Label from "@/ui/common/atoms/Label";
import { RxPerson } from "react-icons/rx";
import Button from "@/ui/common/atoms/Button";
import { GUIDE_BOOKING_MUTATION } from "@/mutation/queries";
import { useMutation } from "@apollo/client";

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

const RequestGuideBooking = ({ id, onClose }: RequestProps) => {
  const { lang } = useLang();
  const { register, handleSubmit } = useForm<FormData>();
  const [requestGuide, { loading }] = useMutation(GUIDE_BOOKING_MUTATION);

  const submit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await requestGuide({
        variables: {
          from: formData.from,
          to: formData.to,
          guideId: id,
          totalPeople: formData.totalPeople,
          totalDays: formData.totalDays,
        },
      });
      console.log(response.data);
      onClose();
    } catch (err) {
      console.error("GraphQL Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[25rem] animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          {authLabel.book[lang]}
        </h2>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <Label name="from" label={authLabel.from[lang]} />
            <InputField
              placeholder={authLabel.from[lang]}
              type="text"
              name="from"
              register={register}
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson />}
            />
          </div>

          <div>
            <Label name="to" label={authLabel.to[lang]} />
            <InputField
              placeholder={authLabel.to[lang]}
              type="text"
              name="to"
              register={register}
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson />}
            />
          </div>

          <div>
            <Label name="totalPeople" label={authLabel.totalPeople[lang]} />
            <InputField
              placeholder={authLabel.totalPeople[lang]}
              type="text"
              name="totalPeople"
              register={register}
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson />}
            />
          </div>

          <div>
            <Label name="totalDays" label={authLabel.totalDays[lang]} />
            <InputField
              placeholder={authLabel.totalDays[lang]}
              type="text"
              name="totalDays"
              register={register}
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson />}
            />
          </div>

        
          <div className="flex justify-center">
            <Button
              buttonText={authLabel.book[lang]}
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestGuideBooking;
