import React, { useEffect, useState } from "react";
import { useMessage } from "../../../contexts/MessageContext";
import StatusCard from "./SuccessMessage";

const PopupMessage: React.FC = () => {
  const { message, setMessage, type } = useMessage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      const popupTime = setTimeout(() => {
        setIsVisible(false);
        setMessage(null, "success");
      }, 3000);

      return () => {
        clearTimeout(popupTime);
      };
    }
  }, [message, setMessage]);

  if (!isVisible || message === null) {
    return null;
  }

  return (
    <div className={`fixed top-32 z-50 right-[53rem]`}>
      {type === "success" ? (
        <StatusCard
          type="success"
          description={message}
          title="success"
          onClick={() => setIsVisible(false)}
        />
      ) : (
        <StatusCard
          type="error"
          description={message}
          title="Error"
          onClick={() => setIsVisible(false)}
        />
      )}
    </div>
  );
};

export default PopupMessage;
