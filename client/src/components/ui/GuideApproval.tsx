import React from 'react';
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Eye, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { APPROVE_GUIDE, GET_GUIDE_REQUESTS, REJECT_GUIDE } from "@/mutation/queries";
import { showToast } from '../ToastNotification';

interface Guides {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  details: {
    citizenshipId: string;
    citizenshipIssueDate: string;
    citizenshipIssueFrom: string;
    district: string;
    DOB: string;
    id: string;
    municipality: string;
    nationality: string;
    passportExpiryDate: string;
    passportId: string;
    passportIssueDate: string;
    passportIssueFrom: string;
    province: string;
    voterAddress: string;
    voterId: string;
  };
  kyc: Kyc[];
}

interface Kyc {
  id: string;
  path: string;
  fileType: string;
}

const GuideApproval = () => {
  const [guides, setGuides] = useState<Guides[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [selectedKycImage, setSelectedKycImage] = useState<string | null>(null);
  const [showRejectionInput, setShowRejectionInput] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [approveGuide] = useMutation(APPROVE_GUIDE);
  const [rejectGuide] = useMutation(REJECT_GUIDE);
  const { loading, error, data, refetch } = useQuery(GET_GUIDE_REQUESTS);
  console.log("🚀 ~ GuideApproval ~ error:", error)
  console.log("🚀 ~ GuideApproval ~ data:", data)

  useEffect(() => {
    if (data?.getGuideApprovalRequestByAdmin) {
      setGuides(data.getGuideApprovalRequestByAdmin);
    }
  }, [data]);

  const handleApproveGuide = async (id: string) => {
    try {
      const res = await approveGuide({
        variables: { guideId: id }
      });
      refetch();
      showToast(res.data.approveGuide,"success");
    } catch (error:unknown) {
      console.error("Failed to approve guide:", error);
      if(error instanceof Error)
      showToast(error.message,"error");
    }
  };

  const handleRejectGuide = async (id: string) => {
    try {
      const res = await rejectGuide({
        variables: { guideId: id, message:rejectionReason }
      });
      refetch();
      setShowRejectionInput(null);
      setRejectionReason("");
      refetch()
      showToast(res.data.rejectGuide,"success");
    } catch (error:unknown) {
        console.error("Failed to approve guide:", error);
        if(error instanceof Error)
        showToast(error.message,"error");
      }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">Error loading guides</p>
          <p className="mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Guide Management</h1>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : guides.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 text-lg">No guides available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className="p-6 cursor-pointer flex items-center justify-between"
                  onClick={() => setSelectedGuideId(guide.id === selectedGuideId ? null : guide.id)}
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {guide.firstName} {guide.middleName} {guide.lastName}
                    </h2>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {guide.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span> {guide.phoneNumber}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Gender:</span> {guide.gender}
                      </p>
                    </div>
                  </div>
                  {selectedGuideId === guide.id ? 
                    <ChevronUp className="h-6 w-6 text-gray-400" /> : 
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  }
                </div>

                {selectedGuideId === guide.id && (
                  <div className="border-t border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                        <div className="space-y-2">
                          <p><span className="font-medium">Nationality:</span> {guide.details.nationality}</p>
                          <p><span className="font-medium">Date of Birth:</span> {guide.details.DOB}</p>
                          <p><span className="font-medium">Province:</span> {guide.details.province}</p>
                          <p><span className="font-medium">District:</span> {guide.details.district}</p>
                          <p><span className="font-medium">Municipality:</span> {guide.details.municipality}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Document Details</h3>
                        <div className="space-y-2">
                          <p><span className="font-medium">Passport ID:</span> {guide.details.passportId}</p>
                          <p><span className="font-medium">Passport Expiry:</span> {guide.details.passportExpiryDate}</p>
                          <p><span className="font-medium">Citizenship ID:</span> {guide.details.citizenshipId}</p>
                          <p><span className="font-medium">Voter ID:</span> {guide.details.voterId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">KYC Documents</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {guide.kyc.map((doc) => (
                          <div key={doc.id} className="relative group">
                            <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden bg-gray-100">
                              <img 
                                src={doc.path} 
                                alt="KYC Document" 
                                className="object-cover w-full h-full"
                              />
                              <p className="font-medium">{doc.fileType}</p>
                              <button
                                onClick={() => setSelectedKycImage(doc.path)}
                                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center"
                              >
                                <Eye className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4">
                      <button
                        onClick={() => handleApproveGuide(guide.id)}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Approve
                      </button>
                      
                      {showRejectionInput === guide.id ? (
                        <div className="flex-1 flex items-center gap-4">
                          <input
                            type="text"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Reason for rejection"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                          <button
                            onClick={() => handleRejectGuide(guide.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => {
                              setShowRejectionInput(null);
                              setRejectionReason("");
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowRejectionInput(guide.id)}
                          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <XCircle className="h-5 w-5 mr-2" />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedKycImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="relative max-w-4xl w-full">
              <img src={selectedKycImage} alt="KYC Document" className="w-full h-auto rounded-lg" />
              <button
                onClick={() => setSelectedKycImage(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-200"
              >
                <XCircle className="h-8 w-8" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideApproval;