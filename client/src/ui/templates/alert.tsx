interface AlertDialogProps {
  title: string;
  message: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  variant?: "success" | "error";
}

export function AlertDialog({
  title,
  message,
  isOpen,
  onCancel,
  onConfirm,
  variant = "error",
}: AlertDialogProps) {
  if (!isOpen) return null;

  const bgColor = variant === "success" ? "bg-blue-900" : "bg-red-900";
  const buttonColor =
    variant === "success"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-red-600 hover:bg-red-700";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`${bgColor} rounded-lg max-w-md w-full p-6 shadow-xl`}>
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-gray-200 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md ${buttonColor} text-white transition-colors`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
