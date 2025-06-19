export interface User {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    email: string;
    phoneNumber: string;
  }
  
  export interface File {
    id: string;
    path: string;
  }
  
  export interface Report {
    id: string;
    createdAt: string;
    file: File[];
    message: string;
    adminResponse?: string;
    status: string
    reportedGuide?: User;
    reporterGuide?: User;
    reportedTravel?: User;
    reporterTravel?: User;
    reportedUser?: User;
    reporterUser?: User;
  }
  
  export interface ReportsData {
    getReports: Report[];
  }
  
  export type FileType = 'image' | 'video' | 'pdf' | 'other';
  
  export function getFileType(path: string): FileType {
    const extension = path.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return 'video';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else {
      return 'other';
    }
  }
  
  export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  export function getFullName(user?: User): string {
    if (!user) return 'N/A';
    return [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(' ');
  }