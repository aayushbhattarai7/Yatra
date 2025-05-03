import React, { useEffect, useMemo, useState } from 'react';
import {
  Users, UserCheck, Building2, DollarSign, TrendingUp, ChevronUp, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useQuery } from '@apollo/client';
import {
  GET_ALL_USERS,
  GET_ALL_GUIDES,
  GET_ALL_TRAVELS,
  GET_HIGHEST_RATED_GUIDES,
  GET_HIGHEST_RATED_TRAVELS,
  GET_TOTAL_REVENUE,
  GET_GROUPED_REVENUE,
} from '@/mutation/queries';
import { homeImage, homeImage1, homeImage2, homeImage3 } from '@/config/constant/image';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Rating {
  rating: number;
}

interface Guide {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  guiding_location: string;
  role: string;
  ratings: Rating[];
}

interface Travel {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  guiding_location: string;
  role: string;
  ratings: Rating[];
}

interface UserImage {
  id: string;
  path: string;
}

interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  image: UserImage | null;
}

interface KYC {
  id: string;
  path: string;
}

interface Provider {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  role: string;
  kyc: KYC | null;
}



const images = [
  homeImage,
homeImage1,
homeImage2,
homeImage3
];

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const AdminHome = () => {
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: guideData } = useQuery<{ getHighestRatedGuides: Guide[] }>(GET_HIGHEST_RATED_GUIDES);
  const { data: travelsData } = useQuery<{ getHighestratedTravels: Travel[] }>(GET_HIGHEST_RATED_TRAVELS);
  const { data: userData } = useQuery<{ getAllUsers: User[] }>(GET_ALL_USERS);
  const { data: travelData } = useQuery<{ getAllTravels: Provider[] }>(GET_ALL_TRAVELS);
  const { data: allGuides } = useQuery<{ getAllGuides: Provider[] }>(GET_ALL_GUIDES);
  const { data: totalRevenue } = useQuery<{ getTotalRevenueByAdmin: number }>(GET_TOTAL_REVENUE);
  const { data: groupedRevenueData } = useQuery(GET_GROUPED_REVENUE);

  const chartData = useMemo(() => {
    if (!groupedRevenueData) return [];
    return groupedRevenueData.getGroupedRevenue[timeFilter] || [];
  }, [groupedRevenueData, timeFilter]);
  console.log("🚀 ~ chartData ~ chartData:", chartData)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const calculateAvgRating = (ratings: Rating[]) => {
    if (!ratings?.length) return 0;
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`Revenue Report - ${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}`, 14, 22);
  
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Time period: ${timeFilter}`, 14, 35);
  
    const headers = [["Period", "Revenue (Rs)"]];
    const data = chartData.map((item: { name: any; revenue: { toLocaleString: () => any; }; }) => [item.name, `Rs ${item.revenue.toLocaleString()}`]);
  
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
  
    doc.save(`revenue_report_${timeFilter}.pdf`);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[500px] mb-[-100px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${images[currentImageIndex]})`,
          }}
        >
          <div className="absolute inset-0 " />
        </div>
        
        <button 
          onClick={previousImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">
            Welcome 
          </h1>
          <p className="text-xl text-center mb-8 max-w-2xl text-gray-100">
            Track your business metrics and performance in real-time
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            label="Total Users" 
            value={userData?.getAllUsers.length ?? 0} 
            icon={<Users className="h-8 w-8" />}
            trend={10}
            color="blue"
          />
          <StatCard 
            label="Active Guides" 
            value={allGuides?.getAllGuides.length ?? 0} 
            icon={<UserCheck className="h-8 w-8" />}
            trend={5}
            color="green"
          />
          <StatCard 
            label="Travel Agencies" 
            value={travelData?.getAllTravels.length ?? 0} 
            icon={<Building2 className="h-8 w-8" />}
            trend={-2}
            color="purple"
          />
          <StatCard 
            label="Total Revenue" 
            value={`Rs ${totalRevenue?.getTotalRevenueByAdmin ?? 0}`} 
            icon={<DollarSign className="h-8 w-8" />}
            trend={15}
            color="yellow"
          />
        </div>

        <div className="mt-8">
          <div className='flex w-full justify-end'>

              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 rounded-lg transition-all duration-200 bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Revenue Overview</h2>
                <p className="text-gray-500">Track your earnings over time</p>
              </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Top Guides</h2>
                <p className="text-gray-500">Highest rated guide partners</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="space-y-4">
              {guideData?.getHighestRatedGuides?.map((guide) => (
                <div key={guide.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800">{guide.firstName} {guide.middleName} {guide.lastName}</p>
                    <p className="text-sm text-gray-500">{guide.guiding_location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">{calculateAvgRating(guide.ratings)}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Top Agencies</h2>
                <p className="text-gray-500">Highest rated travel agencies</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="space-y-4">
              {travelsData?.getHighestratedTravels?.map((travel) => (
                <div key={travel.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800">{travel.firstName} {travel.middleName} {travel.lastName}</p>
                    <p className="text-sm text-gray-500">{travel.guiding_location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">{calculateAvgRating(travel.ratings)}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
              ))}
            </div>
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

export default AdminHome;