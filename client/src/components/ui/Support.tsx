import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Button  from "@/ui/common/atoms/Button";
import { Send, Loader } from "lucide-react";

const SEND_SUPPORT_MESSAGE = gql`
  mutation SendSupportMessage($name: String!, $email: String!, $message: String!) {
    sendSupportMessage(name: $name, email: $email, message: $message) {
      success
      message
    }
  }
`;

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sendMessage, { loading, data, error }] = useMutation(SEND_SUPPORT_MESSAGE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage({ variables: formData });
  };

  return (
    <div className="max-w-lg mx-auto p-6 flex flex-col justify-center bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-travel-primary mb-4">
        Need Help? Contact Us!
      </h2>
      <p className="text-gray-600 mb-6">
        If you have any issues or questions, feel free to send us a message.
      </p>

      {data && data.sendSupportMessage.success ? (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
        {data.sendSupportMessage.message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-travel-primary"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-travel-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Your Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-travel-primary"
              placeholder="Describe your issue or question..."
            />
          </div>

          <Button
            type="submit"
            buttonText={loading ? "Sending..." : "Send Message"}
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
  );
};

export default Support;
