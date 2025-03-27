import { useSocket } from "@/contexts/SocketContext";
import { GET_CHAT_OF_GUIDE } from "@/mutation/queries";
import { gql, useQuery } from "@apollo/client";
import { useState, useEffect, useMemo, useRef } from "react";
import { IoArrowBack, IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { X } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useApolloClient } from "@apollo/client";
const emoji = data;
const GET_CHAT_OF_TRAVEL = gql`
  query GetChatOfTravel($id: String!) {
    getChatOfTravel(id: $id) {
      id
      message
      createdAt
      read
      senderTravel {
        id
        firstName
        middleName
        lastName
      }
      receiverTravel {
        id
        firstName
        middleName
        lastName
      }
    }
  }
`;

interface Travel {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

interface Guide {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

interface Chat {
  id: string;
  createdAt: string;
  message: string;
  read: boolean;
  senderTravel?: Travel;
  senderGuide?: Guide;
  receiverTravel?: Travel;
  receiverGuide?: Guide;
}

interface Details {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
}

const ChatMessages = ({
  details,
  onBack,
}: {
  details: Details;
  onBack: () => void;
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Chat[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const { socket } = useSocket();
  const apolloClient = useApolloClient();
  const emojiData: any = useMemo(() => emoji, []);
  const query =
    details.role === "TRAVEL" ? GET_CHAT_OF_TRAVEL : GET_CHAT_OF_GUIDE;

  const { data, loading, error, refetch } = useQuery(query, {
    variables: { id: details.id },
  });

  const datas =
    details.role === "TRAVEL" ? data?.getChatOfTravel : data?.getChatOfGuide;
  useEffect(() => {
    if (datas) {
      setMessages(datas);
    }
  }, [data]);
  const unreadMessages = messages.filter((msg) => !msg.read);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    socket.emit("mark-as-read", { senderId: details.id, role: details.role });
    refetch();
  };

  useEffect(() => {
    if (messages.length > 0) {
      if (unreadMessages.length > 0) {
        socket.emit("mark-as-read", {
          senderId: details.id,
          role: details.role,
        });
      }
    }
  }, [messages, details.id, socket, unreadMessages]);

  const addEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.emit("get-active-travels");

    const handleNewMessage = (newMessage: Chat) => {
      setMessages((prev) => [...prev, newMessage]);
      apolloClient.cache.modify({
        fields: {
          getChatOfTravel(existingMessages = []) {
            return [...existingMessages, newMessage];
          },
        },
      });
    };
    const handleReadStatus = (senderId: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          (details.role === "TRAVEL"
            ? msg.senderTravel?.id
            : msg.senderGuide?.id) === senderId
            ? { ...msg, read: true }
            : msg,
        ),
      );
    };

    const messageOn =
      details.role === "TRAVEL"
        ? "message-read-by-travel"
        : "message-read-by-guide";
    socket.on(`${messageOn}`, handleReadStatus);
    socket.on("travel-message-to-user", handleNewMessage);

    socket.on("active-travel", (activeUsers: { id: string }[]) => {
      const isUserActive = activeUsers?.some((user) => user.id === details.id);
      setIsActive(isUserActive);
    });

    return () => {
      socket.off("travel-message-to-user", handleNewMessage);
      socket.off("active-travel");
    };
  }, [socket]);

  const closePopUp = () => {
    window.location.href = "/";
  };
  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Chat = {
      id: Date.now().toString(),
      message,
      createdAt: new Date().toLocaleTimeString(),
      read: false,
      receiverTravel: { id: details.id, firstName: "You", lastName: "" },
    };

    const emitMessage =
      details.role === "GUIDE" ? "guide-message" : "travel-message";
    setMessages((prev) => [...prev, newMessage]);
    socket.emit(`${emitMessage}`, { id: details.id, message });
    setMessage("");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full bg-white/80 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-full bg-white/80 rounded-lg">
        <div className="bg-red-50 p-4 rounded-lg shadow-sm">
          <p className="text-red-600 font-medium">{error.message}</p>
        </div>
      </div>
    );

  return (
    <div className="fixed bottom-4 right-4 w-[380px] h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-100">
      <div className="p-3 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
          >
            <IoArrowBack className="text-xl" />
          </button>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {`${details.firstName} ${details.middleName ? details.middleName + " " : ""}${details.lastName}`}
            </h3>
            <div className="flex gap-3 items-center">
              <div
                className={`w-2 h-2  rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
              />
              <p className="text-xs text-gray-500">
                {details.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={closePopUp}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          messages.map((chat) => {
            const isSentTravel =
              (chat.receiverTravel && chat.receiverTravel.id === details.id) ||
              (!chat.senderTravel && !chat.receiverTravel);
            const isSentGuide =
              (chat.receiverGuide && chat.receiverGuide.id === details.id) ||
              (!chat.senderGuide && !chat.receiverGuide);
            const providers =
              details.role === "TRAVEL" ? isSentTravel : isSentGuide;

            return (
              <div
                key={chat.id}
                className={`flex ${providers ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[75%] p-2.5 rounded-2xl text-sm
                    ${
                      providers
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                    } shadow-sm`}
                >
                  <p className="leading-relaxed break-words">{chat.message}</p>
                  <span
                    className={`text-[10px] mt-1 block 
                      ${providers ? "text-blue-200" : "text-gray-400"}`}
                  >
                    {chat?.receiverTravel?.id === details.id && (
                      <p>{chat.read ? "Seen" : "Delivered"}</p>
                    )}
                  </span>
                  <p>{new Date(chat.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-100 sticky bottom-0">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
            >
              <BsEmojiSmile className="text-lg" />
            </button>
            {showPicker && (
              <div className="absolute bottom-12 left-0 z-50 shadow-xl rounded-lg">
                <Picker
                  data={emojiData}
                  set="native"
                  onEmojiSelect={addEmoji}
                />
              </div>
            )}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-full 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              placeholder-gray-400 text-gray-600 text-sm"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 
              transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center"
          >
            <IoSend className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatMessages;
