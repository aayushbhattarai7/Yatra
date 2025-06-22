import React, { useMemo, useState } from 'react';
import {
  Users, DollarSign, ChevronUp, ChevronDown, Download
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useQuery } from '@apollo/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GET_GROUPED_REVENUE_OF_TRAVEL, GET_TOTAL_BOOKED_USERS_BY_TRAVEL, GET_TRAVEL_TOTAL_REVENUE } from '../../mutation/queries';

interface BookedUser {
  id: string;
  from: string;
  to: string;
  totalDays: number;
  totalPeople: number;
  user: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    image: Image[]
  };
}
interface Image{
  id: string;
  type: string;
  path: string;
}

interface RevenueData {
  name: string;
  revenue: number;
}


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const TravelDashboard = () => {
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const { data: groupedRevenueData } = useQuery(GET_GROUPED_REVENUE_OF_TRAVEL);
  const { data: totalRevenue } = useQuery(GET_TRAVEL_TOTAL_REVENUE);
  const { data: bookedUsers } = useQuery(GET_TOTAL_BOOKED_USERS_BY_TRAVEL);


  const chartData = useMemo(() => {
    if (!groupedRevenueData?.getGroupedRevenueOfTravel) return [];
    return groupedRevenueData.getGroupedRevenueOfTravel[timeFilter] || [];
  }, [groupedRevenueData, timeFilter]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`Travel Agency Revenue Report - ${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}`, 14, 22);
  
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Time period: ${timeFilter}`, 14, 35);
  
    const headers = [["Period", "Revenue (Rs)"]];
    const data = chartData.map((item: RevenueData) => [
      item.name, 
      `Rs ${item.revenue.toLocaleString()}`
    ]);
  
    autoTable(doc, {
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        1: { cellWidth: 40 }
      }
    });
  
    doc.save(`travel_agency_revenue_report_${timeFilter}.pdf`);
  };

  const calculateTotalBookings = () => {
    return bookedUsers?.getTotalBookedUsersByTravel?.length || 0;
  };

  const calculateAveragePeoplePerBooking = () => {
    const bookings = bookedUsers?.getTotalBookedUsersByTravel || [];
    if (!bookings.length) return 0;
    const totalPeople = bookings.reduce((sum: any, booking: { totalPeople: any; }) => sum + booking.totalPeople, 0);
    return Math.round(totalPeople / bookings.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Travel Agency Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            label="Total Revenue" 
            value={`Rs ${totalRevenue?.getTravelTotalRevenue ?? 0}`}
            icon={<DollarSign className="h-8 w-8" />}
            trend={15}
            color="blue"
          />
          <StatCard 
            label="Total Bookings" 
            value={calculateTotalBookings()}
            icon={<Users className="h-8 w-8" />}
            trend={8}
            color="green"
          />
          <StatCard 
            label="Avg. Group Size" 
            value={calculateAveragePeoplePerBooking()}
            icon={<Users className="h-8 w-8" />}
            trend={5}
            color="purple"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Revenue Overview</h2>
              <p className="text-gray-500">Track your earnings over time</p>
            </div>
            <div className="flex gap-4">
              <div className="flex gap-2">
                {['daily', 'weekly', 'monthly', 'yearly'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter as any)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      timeFilter === filter 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 rounded-lg transition-all duration-200 bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Booked Users</h2>
              <p className="text-gray-500">List of all your bookings</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Size</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookedUsers?.getTotalBookedUsersByTravel?.map((booking: BookedUser) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {booking.user.image ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={booking.user.image[0].path} 
                              alt="" 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {`${booking.user.firstName} ${booking.user.middleName || ''} ${booking.user.lastName}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {`${booking.from} - ${booking.to}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.totalDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.totalPeople} people
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  trend,
  color
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-green-500/10 text-green-600',
    purple: 'bg-purple-500/10 text-purple-600',
    yellow: 'bg-yellow-500/10 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default TravelDashboard;