import React, { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";
import {
  CANCEL_GUIDE_REQUEST,
  COMPLETE_GUIDE,
  SEND_PRICE_TO_GUIDE,
  USER_REQUESTS_FOR_GUIDE,
} from "@/mutation/queries";
import Button from "@/ui/common/atoms/Button";
import { useMutation, useQuery } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "./ToastNotification";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import InputField from "@/ui/common/atoms/InputField";
import { Clock, Phone, Mail, User, Calendar, MapPin, CreditCard, AlertCircle } from "lucide-react";
import Payments from "./Payments";
import { useSocket } from "@/contexts/SocketContext";
import Rating from "./ui/Rating";
import { useNavigate } from "react-router-dom";

interface GuideBooking {
  id: string;
  from: string;
  to: string;
  totalDays: string;
  totalPeople: string;
  guide: Guide;
  status: string;
  price: string;
  advancePrice: number;
  lastActionBy: string;
  userBargain: number;
  createdAt: string;
}

interface Guide {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
}

interface Price {
  price: string;
}

const GuideBooking = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cancellationId, setCancellationId] = useState<string | null>(null);
  const [guideBooking, setGuideBooking] = useState<GuideBooking[] | []>([]);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [pay, setPay] = useState<boolean>(false);
  const { data, loading, refetch } = useQuery(USER_REQUESTS_FOR_GUIDE);
  const { lang } = useLang();
  const [showCompletionPopup, setShowCompletionPopup] = useState('');
  const [sendPriceToGuide] = useMutation(SEND_PRICE_TO_GUIDE);
  const { register, handleSubmit, reset, setValue } = useForm<Price>();
  const [cancelGuideRequest] = useMutation(CANCEL_GUIDE_REQUEST);
  const [completeGuideServiceByUser] = useMutation(COMPLETE_GUIDE);

  const sendPrice: SubmitHandler<Price> = async (price) => {
    try {
      if (!selectedId) return;
      const res = await sendPriceToGuide({
        variables: { price: price.price, requestId: selectedId },
      });
      refetch();
      showToast(res.data.sendPriceToGuide, "success");
      reset();
      setSelectedId(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || "An error occurred", "error");
      }
    }
  };
  
  useEffect(() => {
    socket.on("get-booking", (booking) => {
      setGuideBooking((prev) => [...prev, booking]);
    });
  }, [socket]);

  const acceptRequest = async () => {
    setPay(true);
  };

  const CancelRequest = async () => {
    const res = await cancelGuideRequest({
      variables: { requestId: cancellationId },
    });
    reset();
    setCancellationId(null);
    refetch();
    showToast(res.data.cancelGuideRequest, "success");
  };

  const completeGuide = async (id: string) => {
    const res = await completeGuideServiceByUser({
      variables: { guideId: id },
    });
    console.log("🚀 ~ completeGuide ~ res:", res)
    reset();
    setShowCompletionPopup(id);
    refetch();
    showToast(res.data.completeGuideServiceByUser, "success");
  };

  useEffect(() => {
    if (data) {
      console.log("🚀 ~ useEffect ~ data:", data)
      setGuideBooking(data.getOwnGuideRequest);
    }
  }, [data]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMATION_PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-8 w-full max-w-4xl p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Guide Bookings</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last updated just now</span>
          </div>
        </div>

        {guideBooking.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideBooking?.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <User className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {book.guide?.firstName} {book.guide?.middleName} {book.guide?.lastName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{book.from} → {book.to}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-sm text-gray-500 mb-1">Total Days</div>
                        <div className="font-medium">{book.totalDays} days</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-sm text-gray-500 mb-1">People</div>
                        <div className="font-medium">{book.totalPeople}</div>
                      </div>
                    </div>

                    {book.status === "ACCEPTED" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{book.guide?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{book.guide?.phoneNumber}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="font-semibold text-lg">
                        Rs. {book.price ? book.price : "Not set"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                      <div className="text-sm text-gray-500">Advance Payment</div>
                      <div className="font-semibold text-lg">
                        Rs. {book.advancePrice ? book.advancePrice : "Not set"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(book.status)}`}>
                        {book.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {book.status === "CANCELLED" ? (
                      <div className="flex items-center justify-center gap-2 text-red-600 py-2 border border-red-200 rounded-xl">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Booking Cancelled</span>
                      </div>
                    ) : (
                      <>
                        {book.status === "COMPLETED" ? (
                          <Button
                            buttonText="Book Again"
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-colors"
                          />
                        ) : (
                          <div className="space-y-3">
                            {book.lastActionBy === "GUIDE" ? (
                              <>
                                {book.status === "CONFIRMATION_PENDING" && (
                                  <Button
                                    onClick={() => completeGuide(book.guide.id)}
                                    buttonText={authLabel.complete[lang]}
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-colors disabled:bg-gray-300"
                                  />
                                )}
                                {book.status !== "ACCEPTED" && book.status !== "CONFIRMATION_PENDING" && (
                                  <>
                                    <Button
                                      onClick={acceptRequest}
                                      buttonText={authLabel.accept[lang]}
                                      type="submit"
                                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-colors"
                                    />
                                    <Button
                                      onClick={() => setSelectedId(book.id)}
                                      buttonText={authLabel.bargain[lang]}
                                      disabled={book.userBargain > 2}
                                      type="submit"
                                      className="w-full bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 rounded-xl font-medium transition-colors disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
                                    />
                                  </>
                                )}
                              </>
                            ) : (
                              <Button
                                buttonText={authLabel.waiting[lang]}
                                disabled={loading}
                                type="submit"
                                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl font-medium transition-colors"
                              />
                            )}
                            
                            <Button
                              buttonText="Cancel Booking"
                              type="submit"
                              onClick={() => setCancellationId(book.id)}
                              className="w-full border text-red-600 hover:bg-red-700 py-3 rounded-xl font-medium transition-colors"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {pay && (
                  <Payments 
                    id={book.id} 
                    refresh={refetch} 
                    onClose={() => setPay(false)} 
                    type="guide" 
                    amount={book.advancePrice}
                  />
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[400px] flex items-center justify-center"
          >
            <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-sm">
              <div className="mb-6">
                <Calendar className="w-16 h-16 text-emerald-200 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Guide Bookings Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start your journey by booking your first guide experience with us.
              </p>
              <button onClick={()=>navigate("/guide")} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">
                <CreditCard className="w-5 h-5" />
                Book Your First Guide
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Set Your Price</h2>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IoClose size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit(sendPrice)} className="space-y-6">
                  <InputField
                    register={register}
                    setValue={setValue}
                    type="text"
                    name="price"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all"
                    placeholder="Enter your price"
                  />
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      buttonText="Submit Price"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-colors"
                    />
                    <Button
                      type="button"
                      buttonText="Cancel"
                      onClick={() => setSelectedId(null)}
                      className="flex-1 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl font-medium transition-colors"
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cancellationId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setCancellationId(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IoClose size={24} />
                  </button>
                </div>
                <div className="text-center mb-6">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Cancel This Booking?
                  </h2>
                  <p className="text-gray-500">
                    This action cannot be undone. Are you sure you want to proceed?
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCancellationId(null)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={CancelRequest}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showCompletionPopup && (
        <Rating 
          onClose={() => setShowCompletionPopup('')}  
          providers="guide" 
          id={showCompletionPopup}
        />
      )}
    </div>
  );
};

export default GuideBooking;