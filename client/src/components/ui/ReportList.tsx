import React, { useState } from 'react';
import { ReportsData } from '../../types';
import ReportCard from './ReportCard';
import { Search, Filter, SortDesc, SortAsc } from 'lucide-react';

interface ReportsListProps {
  data: ReportsData;
  onSelectReport: (reportId: string) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ data, onSelectReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const filteredAndSortedReports = [...data.getReports]
    .filter(report => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      
      if (report.message.toLowerCase().includes(searchLower)) return true;
      
      const users = [
        report.reportedUser, report.reporterUser,
        report.reportedGuide, report.reporterGuide,
        report.reportedTravel, report.reporterTravel
      ].filter(Boolean);
      
      return users.some(user => {
        if (!user) return false;
        const fullName = `${user.firstName} ${user.middleName || ''} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchLower) || user.email.toLowerCase().includes(searchLower);
      });
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search reports by message or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={toggleSortOrder}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {sortOrder === 'desc' ? (
            <>
              <SortDesc size={18} className="mr-2 text-gray-600" />
              <span>Newest First</span>
            </>
          ) : (
            <>
              <SortAsc size={18} className="mr-2 text-gray-600" />
              <span>Oldest First</span>
            </>
          )}
        </button>
      </div>
      
      {filteredAndSortedReports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Filter size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : "There are no reports available"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedReports.map(report => (
            <ReportCard 
              key={report.id} 
              report={report} 
              onClick={() => onSelectReport(report.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsList;