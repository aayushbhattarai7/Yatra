import { useSocket } from "@/contexts/SocketContext";
import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";

const GET_CHAT_OF_TRAVEL = gql`
  query GetChatOfTravel($travelId: String!) {
    getChatOfTravel(travelId: $travelId) {
      id
      message
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

interface Chat {
  id: string;
  message: string;
  read: boolean;
  senderTravel?: Travel;
  receiverTravel?: Travel;
}

const ChatMessages = ({ travelId, onBack }: { travelId: string; onBack: () => void }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Chat[]>([]);
  const { socket } = useSocket();

  const { data, loading, error } = useQuery(GET_CHAT_OF_TRAVEL, {
    variables: { travelId },
  });

  useEffect(() => {
    if (data?.getChatOfTravel) {
      setMessages(data.getChatOfTravel);
    }
  }, [data]);

  useEffect(() => {
    const handleNewMessage = (newMessage: Chat) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("travel-message-to-user", handleNewMessage);

    return () => {
      socket.off("travel-message-to-user", handleNewMessage);
    };
  }, [socket]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Chat = {
      id: Date.now().toString(),
      message,
      read: false,
      senderTravel: { id: travelId, firstName: "You", lastName: "" },
    };

    setMessages((prev) => [...prev, newMessage]); 
    socket.emit("travel-message", { travelId, message });
    setMessage("");
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-96">
      <p className="text-red-500">{error.message}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-[100vh] md:h-96 w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center sticky top-0 bg-white z-10">
        <button 
          onClick={onBack} 
          className="text-blue-600 flex items-center hover:text-blue-800 mr-4 transition-colors duration-200"
        >
          <IoArrowBack className="mr-1" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h3 className="text-lg font-semibold">Chat Messages</h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          messages.map((chat) => {
            const isReceived = chat.receiverTravel || (!chat.senderTravel && !chat.receiverTravel);
            return (
              <div
                key={chat.id}
                className={`flex ${isReceived ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] md:max-w-[60%] p-3 rounded-lg ${
                    isReceived
                      ? "bg-white text-left rounded-tl-none shadow-sm"
                      : "bg-blue-500 text-white text-right rounded-tr-none shadow-sm"
                  }`}
                >
                  <p className="text-sm break-words">{chat.message}</p>
                  <span className={`text-xs mt-1 block ${isReceived ? "text-gray-500" : "text-blue-100"}`}>
                    {chat.read ? "Read" : "Delivered"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 whitespace-nowrap"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatMessages;