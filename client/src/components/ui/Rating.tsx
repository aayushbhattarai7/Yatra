import React, { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@apollo/client";
import { RATE_GUIDE, RATE_TRAVEL } from "@/mutation/queries";
import { showToast } from "../ToastNotification";
interface RatingProps {
  onClose: () => void
  providers: "travel" | "guide",
  id: string
}
const Rating: React.FC<RatingProps> = ({ onClose, id, providers }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [rateTravel] = useMutation(RATE_TRAVEL)
  const [rateGuide] = useMutation(RATE_GUIDE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (providers === "travel") {
        await rateTravel({
          variables: { id: id, rating, message }
        })
      } else {
        await rateGuide({
          variables: { id: id, rating, message }
        })

      }
      onClose()
      showToast("Thank you for your feedback", "success")
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)

    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          className="transition-transform duration-200 hover:scale-110 focus:outline-none"
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`w-8 h-8 ${(hoveredRating || rating) >= starValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
              } transition-colors duration-200`}
          />
        </button>
      );
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <p onClick={onClose}>Back</p>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          close
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              How was your experience?
            </h2>
            <p className="text-gray-600 mb-6">
              Your feedback helps us improve our service
            </p>
            <div className="flex justify-center gap-2 mb-2">{renderStars()}</div>
            <p className="text-sm text-gray-500 h-5">
              {rating > 0 && `You've selected ${rating} star${rating > 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Your Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Tell us what you think..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </button>
        </form>

      </motion.div>
    </div>
  );
};

export default Rating;
