import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Report, formatDate } from '../../types';
import { ArrowLeft, Clock, AlertCircle, FileText, MessageSquare, Shield, Ban } from 'lucide-react';
import { UPDATE_REPORT } from '../../mutation/queries';
import FileViewer from './FileViewer';
import UserInfo from './UserInfo';
import { Badge } from './Badge';

interface ReportDetailProps {
  report: Report;
  onBack: () => void;
  onUpdate: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report, onBack, onUpdate }) => {
  const [adminResponse, setAdminResponse] = useState(report.adminResponse || '');
  const [updateReport] = useMutation(UPDATE_REPORT);
  
  const handleSubmitResponse = async (status: 'resolved' | 'blocked') => {
    console.log("🚀 ~ handleSubmitResponse ~ status:", status)
    if (!adminResponse.trim()) {
      alert('Please provide an admin response before submitting.');
      return;
    }
    
    try {
      await updateReport({
        variables: {
          id: report.id,
          message:adminResponse,
          
        }
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Failed to update report. Please try again.');
    }
  };
  
  const getStatusBadge = () => {
    switch (report.status) {
      case 'blocked':
        return <Badge variant="danger">Blocked</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="p-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Back to list</span>
          </button>
          
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <div className="flex items-center">
              <Clock size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-500">{formatDate(report.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-6">
          <AlertCircle size={20} className="text-red-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Report #{report.id.substring(0, 8)}
          </h2>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <MessageSquare size={18} className="text-gray-700 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Report Message</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="whitespace-pre-line text-gray-700">{report.message}</p>
          </div>
        </div>
        
        {report.file && report.file.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FileText size={18} className="text-gray-700 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Attached Files</h3>
              <Badge className="ml-2">{report.file.length} file(s)</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {report.file.map((file) => (
                <div key={file.id} className="h-48">
                  <FileViewer file={file} className="h-full" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {report.status === 'PENDING' && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Shield size={18} className="text-gray-700 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Admin Response</h3>
            </div>
            <div className="space-y-4">
              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Enter your response to this report..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleSubmitResponse('resolved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <Shield size={16} className="mr-2" />
                  Resolve Report
                </button>
                <button
                  onClick={() => handleSubmitResponse('blocked')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                >
                  <Ban size={16} className="mr-2" />
                  Block User
                </button>
              </div>
            </div>
          </div>
        )}
        
        {report.adminResponse && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Shield size={18} className="text-gray-700 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Admin Response</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <p className="whitespace-pre-line text-gray-700">{report.adminResponse}</p>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Involved Parties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.reportedUser && (
              <UserInfo user={report.reportedUser} type="reported" userType="user" expanded />
            )}
            {report.reporterUser && (
              <UserInfo user={report.reporterUser} type="reporter" userType="user" expanded />
            )}
            {report.reportedGuide && (
              <UserInfo user={report.reportedGuide} type="reported" userType="guide" expanded />
            )}
            {report.reporterGuide && (
              <UserInfo user={report.reporterGuide} type="reporter" userType="guide" expanded />
            )}
            {report.reportedTravel && (
              <UserInfo user={report.reportedTravel} type="reported" userType="travel" expanded />
            )}
            {report.reporterTravel && (
              <UserInfo user={report.reporterTravel} type="reporter" userType="travel" expanded />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;