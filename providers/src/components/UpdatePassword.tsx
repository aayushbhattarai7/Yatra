import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Label from "../ui/common/atoms/Label";
import InputField from "../ui/common/atoms/InputField";
import Button from "../ui/common/atoms/Button";
import { showToast } from "./ToastNotification";
import { UPDATE_GUIDE_PASSWORD, UPDATE_TRAVEL_PASSWORD } from "../mutation/queries";
import { authLabel } from "../localization/auth";
import { useLang } from "../hooks/useLang";
import { useNavigate } from "react-router-dom";
import { Lock } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../function/GetCookie";

interface FormData {
    password: string;
    confirmPassword: string;
    currentPassword: string;
}


const UpdatePassword = () => {
    const { register, handleSubmit, control, setValue, reset } = useForm<FormData>();
    const { lang } = useLang();
    const navigate = useNavigate();
      const token = getCookie("accessToken")!
      const decodedToken:any = jwtDecode(token)
    const [updatePasswordOfGuide, { loading:guideLoading }] = useMutation(UPDATE_GUIDE_PASSWORD);
    const [updatePasswordOfTravel, { loading:travelLoading }] = useMutation(UPDATE_TRAVEL_PASSWORD);
    
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const updateQuery = decodedToken.role==="TRAVEL"?updatePasswordOfTravel:updatePasswordOfGuide
            const response = await updateQuery({ 
                variables: {currentPassword:data.currentPassword,
                    password: data.password, 
                    confirmPassword: data.confirmPassword, 
                    
                } 
            });
            const message = decodedToken.role==="TRAVEL"?response.data.updatePasswordOfTravel:response.data.updatePasswordOfGuide

            showToast(message, "success");
            reset();
            navigate("/");
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            } else {
                showToast("An error occurred", 'error');
            }
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{authLabel.newPass[lang]}</h2>
                <p className="text-gray-600 text-center mb-8">
                {authLabel.newPass[lang]}<br />
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="w-full space-y-6"
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                        <Label 
                                name="password" 
                                label={authLabel.newPassword[lang]}
                                className="text-sm font-medium text-gray-700"
                            />
                            <InputField
                            control={control}
                                setValue={setValue}
                                placeholder={authLabel.enterNewPassword[lang]}
                                type="password"
                                name="currentPassword"
                                register={register}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />

                            <Label 
                                name="password" 
                                label={authLabel.newPassword[lang]}
                                className="text-sm font-medium text-gray-700"
                            />
                            <InputField
                            control={control}
                                setValue={setValue}
                                placeholder={authLabel.enterNewPassword[lang]}
                                type="password"
                                name="password"
                                register={register}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label 
                                name="confirmPassword" 
                                label={authLabel.confirmPassword[lang]}
                                className="text-sm font-medium text-gray-700"
                            />
                            <InputField
                            control={control}
                                setValue={setValue}
                                placeholder={authLabel.confirmYourPassword[lang]}
                                type="password"
                                name="confirmPassword"
                                register={register}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    <Button
                        buttonText={guideLoading || travelLoading ? `${authLabel.updating[lang]}` : `${authLabel.updatePassword[lang]}`}
                        name="update"
                        type="submit"
                        disabled={guideLoading || travelLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    />
                </form>

                <p className="mt-6 text-sm text-gray-500 text-center">
                    {authLabel.passwordDesc[lang]}
                </p>
            </div>
        </div>
    );
};

export default UpdatePassword;