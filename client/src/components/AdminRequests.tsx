import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { MapPin, Users, Calendar, DollarSign, Mail, Phone } from 'lucide-react';
import { GET_ALL_TRAVEL_REQUESTS_BY_ADMIN, GET_ALL_GUIDE_REQUESTS_BY_ADMIN } from '@/mutation/queries';

interface Image {
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
    gender: string;
    image: Image[];
}

interface TravelGuide {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    kyc: Kyc[];
}

interface TravelRequest {
    id: string;
    from: string;
    to: string;
    price: number;
    status: string;
    totalDays: number;
    totalPeople: number;
    advancePrice: number;
    user: User;
    travel: TravelGuide;
}

interface GuideRequest {
    id: string;
    from: string;
    to: string;
    price: number;
    status: string;
    totalDays: number;
    totalPeople: number;
    advancePrice: number;
    users: User;
    guide: TravelGuide;
}

interface TravelRequestsData {
    getAllTravelRequestsByAdmin: TravelRequest[];
}

interface GuideRequestsData {
    getAllGuideRequestsByAdmin: GuideRequest[];
}

interface Kyc {
    id: string;
    path: string;
    fileType: string;
}

export const RequestsTable = () => {
    const [activeTab, setActiveTab] = useState<'travel' | 'guide'>('travel');

    const {
        data: travelData,
        loading: travelLoading,
    } = useQuery<TravelRequestsData>(GET_ALL_TRAVEL_REQUESTS_BY_ADMIN);

    const {
        data: guideData,
        loading: guideLoading,
    } = useQuery<GuideRequestsData>(GET_ALL_GUIDE_REQUESTS_BY_ADMIN);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderUserInfo = (user: User) => (
        <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex-shrink-0">
                <img
                    src={user.image[0]?.path}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                />
            </div>
            <div>
                <div className="font-medium text-gray-900">
                    {`${user.firstName} ${user.middleName} ${user.lastName}`.trim()}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    <span>{user.phoneNumber}</span>
                </div>
            </div>
        </div>
    );

    const renderTravelGuideInfo = (guide: TravelGuide) => (
        <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex-shrink-0">
                <img
                    src={guide.kyc[0]?.path}
                    alt={`${guide.firstName} ${guide.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                />
            </div>
            <div>
                <div className="font-medium text-gray-900">
                    {`${guide.firstName} ${guide.middleName} ${guide.lastName}`.trim()}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span>{guide.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    <span>{guide.phoneNumber}</span>
                </div>
            </div>
        </div>
    );

    if (travelLoading || guideLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }



    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <div className="sm:hidden">
                    <select
                        className="block w-full rounded-md border-gray-300 py-2"
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value as 'travel' | 'guide')}
                    >
                        <option value="travel">Travel Requests</option>
                        <option value="guide">Guide Requests</option>
                    </select>
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('travel')}
                                className={`${activeTab === 'travel'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                            >
                                Travel Requests
                            </button>
                            <button
                                onClick={() => setActiveTab('guide')}
                                className={`${activeTab === 'guide'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                            >
                                Guide Requests
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Request Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {activeTab === 'travel' ? 'User' : 'Users'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {activeTab === 'travel' ? 'Travel Guide' : 'Guide'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activeTab === 'travel' && travelData?.getAllTravelRequestsByAdmin.map((request) => (
                                <tr key={request.id}>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <MapPin className="h-4 w-4" />
                                                <span>{request.from} → {request.to}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <Users className="h-4 w-4" />
                                                <span>{request.totalPeople} people</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                <span>{request.totalDays} days</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <DollarSign className="h-4 w-4" />
                                                <span>Rs.{request.price}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <DollarSign className="h-4 w-4" />
                                                <span>Rs.{request.advancePrice}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderUserInfo(request.user)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderTravelGuideInfo(request.travel)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {activeTab === 'guide' && guideData?.getAllGuideRequestsByAdmin.map((request) => (
                                <tr key={request.id}>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <MapPin className="h-4 w-4" />
                                                <span>{request.from} → {request.to}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <Users className="h-4 w-4" />
                                                <span>{request.totalPeople} people</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                <span>{request.totalDays} days</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <DollarSign className="h-4 w-4" />
                                                <span>Rs.{request.price}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <DollarSign className="h-4 w-4" />
                                                <span>Rs.{request.advancePrice}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderUserInfo(request.users)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderTravelGuideInfo(request.guide)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}