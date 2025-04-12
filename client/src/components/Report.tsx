import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Film, Image as ImageIcon, AlertCircle } from 'lucide-react';
import axiosInstance from '@/service/axiosInstance';

interface ReportProps {
  id: string;
  onClose: () => void;
  type: 'travel' | 'guide';
}

interface MediaFile extends File {
  preview: string;
  mediaType: 'video' | 'image';
}

const Report: React.FC<ReportProps> = ({ id, onClose, type }) => {
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (media.length + acceptedFiles.length > 5) {
      setError('Maximum 5 files allowed');
      return;
    }

    const newMedia: MediaFile[] = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          mediaType: (file.type.startsWith('video/') ? 'video' : 'image') as 'video' | 'image',
        })
      );
      

    setMedia((prev) => [...prev, ...newMedia]);
    setError('');
  }, [media]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    maxSize: 100 * 1024 * 1024,
    maxFiles: 5,
  });

  const removeMedia = (index: number) => {
    setMedia((prev) => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[index].preview);
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Please provide a message');
      return;
    }

    const formData = new FormData();
    formData.append('message', message);

    media.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const routeName = type === 'travel' ? '/user/report-travel' : '/user/report-guide';
      await axiosInstance.post(`${routeName}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onClose();
    } catch (err) {
      setError('Failed to submit the report. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Submit Report</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Describe the issue
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all"
                placeholder="Please provide details about your report..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Media (Optional)
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? 'Drop your files here'
                      : 'Drag & drop files here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Maximum 5 files (Images: JPEG, PNG | Videos: MP4, MOV, AVI)
                  </p>
                  <p className="text-xs text-gray-500">Maximum file size: 100MB</p>
                </div>
              </div>

              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {media.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {media.map((file, index) => (
                    <div key={file.preview} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {file.mediaType === 'video' ? (
                          <video src={file.preview} className="w-full h-full object-cover" controls />
                        ) : (
                          <img src={file.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 left-2">
                          {file.mediaType === 'video' ? (
                            <Film className="w-5 h-5 text-white drop-shadow-lg" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-white drop-shadow-lg" />
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
