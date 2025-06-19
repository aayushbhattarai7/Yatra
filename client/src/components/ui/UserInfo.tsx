import React from 'react';
import { User, getFullName } from '../../types';
import { Avatar } from './avatar';
import { Badge } from './Badge';
import { Mail, Phone } from 'lucide-react';

interface UserInfoProps {
  user?: User;
  type: 'reporter' | 'reported';
  userType: 'guide' | 'travel' | 'user';
  expanded?: boolean;
  className?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ 
  user, 
  type, 
  userType,
  expanded = false,
  className = '' 
}) => {
  if (!user) return null;
  
  const fullName = getFullName(user);
  const typeLabel = type === 'reporter' ? 'Reporter' : 'Reported';
  const userTypeCapitalized = userType.charAt(0).toUpperCase() + userType.slice(1);
  
  const getBadgeVariant = () => {
    if (type === 'reporter') return 'outline';
    return 'danger';
  };
  
  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center mb-3">
        <Avatar name={fullName} className="mr-3" />
        <div>
          <h3 className="font-medium text-gray-900">{fullName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getBadgeVariant()}>
              {typeLabel} {userTypeCapitalized}
            </Badge>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 text-sm text-gray-600 space-y-2">
          <div className="flex items-center">
            <Mail size={16} className="mr-2" />
            <a href={`mailto:${user.email}`} className="hover:text-blue-600 transition-colors">
              {user.email}
            </a>
          </div>
          <div className="flex items-center">
            <Phone size={16} className="mr-2" />
            <a href={`tel:${user.phoneNumber}`} className="hover:text-blue-600 transition-colors">
              {user.phoneNumber}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;