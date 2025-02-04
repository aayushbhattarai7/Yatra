import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (message: string, type: "success" | "error") => {
  if (type === "success") {
    toast.success(` ${message}`);
  } else {
    toast.error(`${message}`);
  }
};

const ToastNotification = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
    />
  );
};

export default ToastNotification;
