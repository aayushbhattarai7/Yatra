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
    }
  }
`;

const ChatMessages = ({ travelId, onBack }: { travelId: string; onBack: () => void }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { socket } = useSocket();

  const { data, loading, error, refetch } = useQuery(GET_CHAT_OF_TRAVEL, {
    variables: { travelId },
    onCompleted: (data) => setMessages(data?.getChatOfTravel || []),
  });

  useEffect(() => {
    socket.on("travel-message", (newMessage: any) => {
      setMessages((prev) => [...prev, newMessage]); 
    });

    return () => {
      socket.off("travel-message");
    };
  }, [socket]);

  const chat = async (e: any) => {
    e.preventDefault();
    const newMessage = { id: Date.now(), message, read: false };
    setMessages((prev) => [...prev, newMessage]);
    socket.emit("travel-message", { travelId, message });
    setMessage("");
    refetch(); 
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="flex flex-col h-96">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <button onClick={onBack} className="text-blue-600 flex hover:text-blue-800 mr-4">
          <span className="flex pt-1">
            <IoArrowBack />
          </span>
          Back
        </button>
        <h3 className="text-lg font-semibold">Chat Messages</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages</p>
        ) : (
          messages.map((chat) => (
            <div key={chat.id} className="p-2 border-b border-gray-100 last:border-0">
              <p className="text-sm text-gray-800">{chat.message}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">{chat.read ? "Read" : "Delivered"}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={chat} className="flex gap-2">
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
