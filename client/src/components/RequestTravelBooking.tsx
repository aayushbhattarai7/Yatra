import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '@/ui/common/atoms/InputField';
import { authLabel } from '@/localization/auth';
import { useLang } from '@/hooks/useLang';
import Label from '@/ui/common/atoms/Label';
import { RxPerson } from 'react-icons/rx';

import Button from '@/ui/common/atoms/Button';
import { BOOKING_MUTATION } from '@/mutation/signupmutation';
import { useMutation } from '@apollo/client';

interface RequestProps {
    id:string
}
interface FormData {
    id:string
  vehicleType: string;
    totalPeople: string;
    totalDays: string;
    to: string;
    from: string;
    
}
const RequestTravelBooking = ({
  id, 
}: RequestProps) => {
    const { lang } = useLang();
    const { register, handleSubmit } = useForm<FormData>({
      defaultValues: {
        id:"",
  vehicleType: "",
    totalPeople: "",
    totalDays: "",
    to: "",
    from: "",
      },
    });
  const [requestTravel, {  loading }] = useMutation(BOOKING_MUTATION);
  const submit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await requestTravel({
        variables: { from: formData.from, to: formData.to, vehicleType:formData.vehicleType, travelId:id, totalPeople:formData.totalPeople, totalDays:formData.totalDays},
      });
        console.log(response.data)
    
    } catch (err) {
      if (err instanceof Error) {
        console.log("ohno");

        console.error("GraphQL Error:", err.message);
      } else {
        console.error("Unexpected Error:", err);
      }
    }
  };


  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="mt-8 space-y-6 flex justify-center items-center flex-col"
    >
      <div className="space-y-4">
        <div>
          <Label name="from" label={authLabel.from[lang]} />
          <div className="relative">
            <InputField
              placeholder={authLabel.from[lang]}
              type="text"
              name="from"
              register={register}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson className="font-bold" />}
            />
          </div>
        </div>
        <div>
          <Label name="to" label={authLabel.to[lang]} />
          <div className="relative">
            <InputField
              placeholder={authLabel.to[lang]}
              type="text"
              name="to"
              register={register}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson className="font-bold" />}
            />
          </div>
        </div>
        <div>
          <Label name="totalPeople" label={authLabel.totalPeople[lang]} />
          <div className="relative">
            <InputField
              placeholder={authLabel.totalPeople[lang]}
              type="text"
              name="totalPeople"
              register={register}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson className="font-bold" />}
            />
          </div>
        </div>
        <div>
          <Label name="totalDays" label={authLabel.totalDays[lang]} />
          <div className="relative">
            <InputField
              placeholder={authLabel.totalDays[lang]}
              type="text"
              name="totalDays"
              register={register}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson className="font-bold" />}
            />
          </div>
        </div>
        <div>
          <Label name="vehicleType" label={authLabel.vehicleType[lang]} />
          <div className="relative">
            <InputField
              placeholder={authLabel.vehicleType[lang]}
              type="text"
              name="vehicleType"
              register={register}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              icon={<RxPerson className="font-bold" />}
            />
          </div>
        </div>
      </div>
      <div></div>
      <div className="w-[23rem] flex justify-center items-center">
        <Button
          buttonText={authLabel.book[lang]}
          name=""
          type="submit"
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default RequestTravelBooking