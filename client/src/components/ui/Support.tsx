import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Button from "@/ui/common/atoms/Button";
import { Send, Loader } from "lucide-react";
import { authLabel } from "@/localization/auth";
import { useLang } from "@/hooks/useLang";

const SEND_SUPPORT_MESSAGE = gql`
mutation SendSupportMessage($message: String!, $name: String!, $email: String!) {
  sendSupportMessage(message: $message, name: $name, email: $email)
}
`;

const Support = () => {
  const { lang } = useLang();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sendSupportMessage, { loading, data, error }] = useMutation(SEND_SUPPORT_MESSAGE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendSupportMessage({ variables:{name:formData.name, email:formData.email, message:formData.message}  });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-lg mx-auto p-6 flex flex-col justify-center bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-travel-primary mb-4">
          {authLabel.supportHeading[lang]}
        </h2>
        <p className="text-gray-600 mb-6">
          {authLabel.supportSubheading[lang]}
        </p>

        {data && data.sendSupportMessage.success ? (
          <div className="p-4 bg-green-100 text-green-700 rounded-md">
            {data.sendSupportMessage.message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {authLabel.supportNameLabel[lang]}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-travel-primary"
                placeholder={authLabel.supportNamePlaceholder[lang]}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {authLabel.supportEmailLabel[lang]}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-travel-primary"
                placeholder={authLabel.supportEmailPlaceholder[lang]}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {authLabel.supportMessageLabel[lang]}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-travel-primary"
                placeholder={authLabel.supportMessagePlaceholder[lang]}
              />
            </div>

            <Button
              type="submit"
              buttonText={loading ? authLabel.supportButtonSending[lang] : authLabel.supportButtonText[lang]}
              className="w-full bg-travel-primary hover:bg-travel-primary-dark"
              disabled={loading}
              icon={loading ? <Loader className="animate-spin" /> : <Send />}
            />
          </form>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md mt-4">
            ⚠️ {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
