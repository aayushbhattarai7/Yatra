import React, { createContext, ReactNode, useContext, useState } from "react";

interface MessageContextProps {
  message: string | null;
  setMessage: (message: string | null, type: "success" | "error") => void;
  type: "success" | "error" | null;
}

interface MessageProviderProps {
  children: ReactNode;
}

const MessageContext = createContext<MessageContextProps>({
  message: null,
  setMessage: () => {},
  type: null,
});

export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
}) => {
  const [message, setMessageState] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | null>(null);

  const setMessage = (message: string | null, type: "success" | "error") => {
    setMessageState(message);
    setType(type);
  };

  return (
    <MessageContext.Provider value={{ message, setMessage, type }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
