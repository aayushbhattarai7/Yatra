import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REPORTS } from '../../mutation/queries';
import { Report } from '../../types';
import ReportsList from './ReportList';
import ReportDetail from './ReportDetails';
import { AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const { loading, error, data, refetch } = useQuery(GET_REPORTS);
  
  const selectedReport = selectedReportId && data?.getReports 
    ? data.getReports.find((report: Report) => report.id === selectedReportId)
    : null;
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <p>Error loading reports: {error.message}</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports Management</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Review and manage reported users, guides, and travel agencies. All reports are handled with confidentiality.
        </p>
      </header>
      
      {selectedReport ? (
        <ReportDetail 
          report={selectedReport} 
          onBack={() => setSelectedReportId(null)}
          onUpdate={() => {
            refetch();
            setSelectedReportId(null);
          }}
        />
      ) : (
        <>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-md">
            <div className="flex">
              <AlertTriangle size={20} className="text-amber-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Important Notice</h3>
                <p className="text-amber-700 text-sm mt-1">
                  All reports should be reviewed within 48 hours. High priority reports will be marked with a red indicator.
                </p>
              </div>
            </div>
          </div>
          
          <ReportsList 
            data={data} 
            onSelectReport={setSelectedReportId} 
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;