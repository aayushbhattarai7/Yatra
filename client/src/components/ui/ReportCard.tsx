import React from 'react';
import { Report, formatDate, getFullName } from '../../types';
import { ChevronRight, FileText, AlertCircle, Clock } from 'lucide-react';
import FileViewer from './FileViewer';
import { Avatar } from './avatar';
import { Badge } from './Badge';

interface ReportCardProps {
  report: Report;
  onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onClick }) => {
  const primaryUser = report.reportedUser || report.reportedGuide || report.reportedTravel;
  const reporterUser = report.reporterUser || report.reporterGuide || report.reporterTravel;
  
  const getTruncatedMessage = (message: string, maxLength = 100) => {
    if (message.length <= maxLength) return message;
    return `${message.substring(0, maxLength)}...`;
  };
  
  const previewFile = report.file && report.file.length > 0 ? report.file[0] : null;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row">
        {previewFile && (
          <div className="sm:w-36 h-36 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none overflow-hidden bg-gray-100">
            <FileViewer file={previewFile} className="w-full h-full" />
          </div>
        )}
        
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <AlertCircle size={16} className="text-red-500 mr-2" />
              <h3 className="font-medium text-gray-900">Report #{report.id.substring(0, 8)}</h3>
            </div>
            <Badge variant="outline" className="flex items-center">
              <Clock size={12} className="mr-1" />
              <span>{formatDate(report.createdAt)}</span>
            </Badge>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {getTruncatedMessage(report.message)}
          </p>
          
          <div className="flex flex-wrap items-center mt-2 justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              {reporterUser && (
                <div className="flex items-center mr-4">
                  <Avatar name={getFullName(reporterUser)} size="sm" className="mr-2" />
                  <div className="text-xs">
                    <p className="font-medium text-gray-900">{getFullName(reporterUser)}</p>
                    <p className="text-gray-500">Reporter</p>
                  </div>
                </div>
              )}
              
              {primaryUser && (
                <div className="flex items-center">
                  <Avatar name={getFullName(primaryUser)} size="sm" className="mr-2" />
                  <div className="text-xs">
                    <p className="font-medium text-gray-900">{getFullName(primaryUser)}</p>
                    <p className="text-gray-500">Reported</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              {report.file && report.file.length > 1 && (
                <Badge variant="default" className="mr-2">
                  <FileText size={12} className="mr-1" />
                  +{report.file.length - 1} files
                </Badge>
              )}
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;