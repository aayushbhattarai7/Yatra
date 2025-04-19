import React from 'react';
import { File as FileType, getFileType } from '../../types/index';
import { FileIcon, File as FilePdf } from 'lucide-react';

interface FileViewerProps {
  file: FileType;
  className?: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ file, className = '' }) => {
  const fileType = getFileType(file.path);
  
  switch (fileType) {
    case 'image':
      return (
        <div className={`relative rounded-md overflow-hidden bg-gray-100 ${className}`}>
          <img 
            src={file.path} 
            alt="Report attachment" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.classList.add('p-4');
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              e.currentTarget.parentElement?.appendChild(
                (() => {
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>';
                  return icon.firstChild as Node;
                })()
              );
            }}
          />
        </div>
      );
    
    case 'video':
      return (
        <div className={`relative rounded-md overflow-hidden bg-gray-100 ${className}`}>
          <video 
            src={file.path} 
            controls 
            className="w-full h-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'p-6');
              e.currentTarget.parentElement?.appendChild(
                (() => {
                  const div = document.createElement('div');
                  div.className = 'text-gray-400 flex flex-col items-center';
                  div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"></path><rect width="20" height="12" x="2" y="10" rx="2"></rect></svg><p class="mt-2 text-sm">Video unavailable</p>';
                  return div;
                })()
              );
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
      
    case 'pdf':
      return (
        <div className={`flex items-center justify-center bg-gray-100 rounded-md ${className} p-6`}>
          <a 
            href={file.path} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FilePdf size={32} className="text-red-500 mb-2" />
            <span className="text-sm">View PDF</span>
          </a>
        </div>
      );
      
    default:
      return (
        <div className={`flex items-center justify-center bg-gray-100 rounded-md ${className} p-6`}>
          <a 
            href={file.path} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FileIcon size={32} className="text-gray-500 mb-2" />
            <span className="text-sm truncate max-w-full">
              {file.path.split('/').pop() || 'Unknown file'}
            </span>
          </a>
        </div>
      );
  }
};

export default FileViewer;