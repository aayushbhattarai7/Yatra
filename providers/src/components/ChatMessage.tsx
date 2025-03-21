import { useSocket } from "../contexts/SocketContext";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { getCookie } from "../function/GetCookie";
import { jwtDecode } from "jwt-decode";

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
  const token = getCookie("accessToken")
  const decodedToken:any = jwtDecode(token!)
  const query = decodedToken.role==="TRAVEL"?GET_CHAT_OF_TRAVEL:GET_CHAT_OF_GUIDE
  const [messages, setMessages] = useState<Chat[]>([]);
  const { socket } = useSocket();
  const { data, loading, error } = useQuery(query, { variables: { userId } });

  useEffect(() => {
    if (data?.getChatOfUserByTravel) {
      setMessages(data.getChatOfUserByTravel);
    }
  }, [data]);

  useEffect(() => {
    const handleNewMessage = (chat: Chat) => {
      setMessages((prevMessages) => [...prevMessages, chat]);
    };

    socket.on("travel-message", handleNewMessage);

    return () => {
      socket.off("travel-message", handleNewMessage);
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

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit("travel-message-user", { user_id: userId, message });

    setMessage("");
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="flex flex-col h-96">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <button onClick={onBack} className="text-blue-600 flex hover:text-blue-800 mr-4">
          <IoArrowBack className="mr-2" />
          Back
        </button>
        <h3 className="text-lg font-semibold">Chat Messages</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages</p>
        ) : (
          messages.map((chat) => {
            const isSent = chat.receiverUser && chat.receiverUser.id === userId;
            return (
              <div key={chat.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg ${
                    isSent ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
                  } max-w-xs shadow-md`}
                >
                  <p className="text-sm">{chat.message}</p>
                  <span className="text-xs text-gray-500">{chat.read ? "Read" : "Delivered"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatMessages;
