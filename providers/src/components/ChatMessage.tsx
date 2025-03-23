import { useSocket } from "../contexts/SocketContext";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoArrowBack, IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { X } from 'lucide-react';
import { getCookie } from "../function/GetCookie";
import { jwtDecode } from "jwt-decode";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const emoji = data;

const GET_CHAT_OF_TRAVEL = gql`
  query GetChatOfUserByTravel($userId: String!) {
    getChatOfUserByTravel(userId: $userId) {
      id
      message
      read
      senderUser {
        id
        firstName
        middleName
        lastName
      }
      receiverUser {
        id
        firstName
        middleName
        lastName
      }
    }
  }
`;

const GET_CHAT_OF_GUIDE = gql`
  query GetChatOfUserByGuide($userId: String!) {
    getChatOfUserByGuide(userId: $userId) {
      id
      message
      read
      senderUser {
        id
        firstName
        middleName
        lastName
      }
      receiverUser {
        id
        firstName
        middleName
        lastName
      }  
      }
      }
      `;
      
      interface User {
        id: string;
        firstName: string;
        middleName?: string;
        lastName: string;
      }
      
      interface Chat {
        id: string;
        message: string;
  read: boolean;
  senderUser?: User;
  receiverUser?: User;
}

const ChatMessages = ({ userId, onBack }: { userId: string; onBack: () => void }) => {
  const [message, setMessage] = useState("");
  const token = getCookie("accessToken");
  const decodedToken: any = jwtDecode(token!);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const { socket } = useSocket();
  const query = decodedToken.role === "TRAVEL" ? GET_CHAT_OF_TRAVEL : GET_CHAT_OF_GUIDE;
  const { data, loading, error } = useQuery(query, { variables: { userId } });
  const datas = decodedToken.role === "TRAVEL" ? data?.getChatOfUserByTravel : data?.getChatOfUserByGuide;
  const emojiData: any = useMemo(() => emoji, []);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (datas) {
      setMessages(datas);
    }
  }, [data]);
  const scrollToBottom = () => {
    const unreadMessages = messages.filter(msg => !msg.read);
    console.log("🚀 ~ scrollToBottom ~ unreadMessages:", unreadMessages)
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   const emitTo =  decodedToken.role === "TRAVEL"?"mark-read-by-travel":"mark-read-by-guide"
  //  if(unreadMessages.length >0){
  //    socket.emit(`${emitTo}`,({senderId:userId}))
  //  }
  };


 

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowPicker(false);
  };
  useEffect(() => {
    const handleNewMessage = (chat: Chat) => {
      setMessages((prevMessages) => [...prevMessages, chat]);
    };
    const unreadMessages = messages.filter(msg => !msg.read);
    if (unreadMessages.length > 0) {
    }
    const handleReadStatus = (readMessages: { senderId: string }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.senderUser?.id === readMessages.senderId ? { ...msg, read: true } : msg
        )
      );
    };
    socket.on("message-read", handleReadStatus);
    socket.on("travel-message", handleNewMessage);
    socket.on("guide-message", handleNewMessage);
    
    return () => {
      socket.off("travel-message", handleNewMessage);
      socket.off("guide-message", handleNewMessage);
      socket.off("message-read", handleReadStatus);

    };
  }, [socket]);
  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage: Chat = {
      id: Date.now().toString(),
      message,
      read: false,
      receiverUser: { id: userId, firstName: "", lastName: "" },
    };
    const emitMessage = decodedToken.role === "TRAVEL" ? "travel-message-user" : "guide-message-user";

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit(`${emitMessage}`, { user_id: userId, message });
    setMessage("");
  };

  if (loading) return (
    <div className="fixed bottom-4 right-4 w-[380px] h-[500px] bg-white/80 rounded-lg shadow-2xl flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="fixed bottom-4 right-4 w-[380px] h-[500px] bg-white/80 rounded-lg shadow-2xl flex items-center justify-center">
      <div className="bg-red-50 p-4 rounded-lg">
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
            <h3 className="text-sm font-semibold text-gray-800">Chat Messages</h3>
            <p className="text-xs text-gray-500">{decodedToken.role.toLowerCase()}</p>
          </div>
        </div>
        <button 
          onClick={onBack}
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
            const isSent = chat.receiverUser && chat.receiverUser.id === userId;
            return (
              <div key={chat.id} className={`flex ${isSent ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div
                  className={`max-w-[75%] p-2.5 rounded-2xl text-sm
                    ${isSent
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                    } shadow-sm`}
                >
                  <p className="leading-relaxed break-words">{chat.message}</p>
                  <span 
                    className={`text-[10px] mt-1 block 
                      ${isSent ? "text-blue-200" : "text-gray-400"}`}
                  >
  {chat?.receiverUser?.id === userId && (
<p>

  {chat.read ? "Seen" : "Delivered"}
</p>
                    )}                  </span>
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
                <Picker data={emojiData} set="native" onEmojiSelect={addEmoji} />
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