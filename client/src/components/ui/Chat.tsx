import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction } from "react";
import { useQuery, gql } from "@apollo/client";
import { useSocket } from "@/contexts/SocketContext";
import { IoArrowBack } from "react-icons/io5";
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
const GET_ROOM_CHATS = gql`
  query GetRoomChats {
    getConnectedUsers {
      id
      travel {
        id
        firstName
        lastName
        kyc {
          path
        }
      }
    }
  }
`;

const GET_CHAT_OF_TRAVEL = gql`
  query GetChatOfTravel($travelId: String!) {
    getChatOfTravel(travelId: $travelId) {
      id
      message
      read
      senderTravel {
        id
        firstName
        lastName
      }
      receiverTravel {
        id
        firstName
        lastName
      }
    }
  }
`;

const Chat = () => {
  const [selectedTravelId, setSelectedTravelId] = useState<string | null>(null);
  const { socket } = useSocket();
  const { data, loading, error } = useQuery(GET_ROOM_CHATS);
  const usersInRoom = data?.getConnectedUsers || [];

  const {
    data: chatData,
    loading: chatLoading,
    error: chatError,
  } = useQuery(GET_CHAT_OF_TRAVEL, {
    variables: { travelId: selectedTravelId },
    skip: !selectedTravelId,
  });

  const [messages, setMessages] = useState(chatData?.getChatOfTravel || []);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleNewMessage = (newMessage: Chat) => {
      setMessages((prev: any) => [...prev, newMessage]);
    };
  
    socket.on("travel-message-to-user", handleNewMessage);
  
    return () => {
      socket.off("travel-message-to-user", handleNewMessage);
    };
  }, [socket]);
  
  useEffect(() => {
    if (chatData?.getChatOfTravel) {
      setMessages(chatData.getChatOfTravel);
    }
  }, [chatData]);



  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!message.trim() || !selectedTravelId) return;
    const newMessage = {
      id: Date.now().toString(),
      message,
      read: false,
      senderTravel: { id: selectedTravelId, firstName: "You", lastName: "" },
    };
    setMessages((prev: any) => [...prev, newMessage]);
    socket.emit("travel-message", { travelId: selectedTravelId, message });
    setMessage("");
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {selectedTravelId ? (
        <div className="flex flex-col h-96 w-full max-w-2xl bg-white rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center">
            <button onClick={() => setSelectedTravelId(null)} className="text-blue-600 flex items-center">
              <IoArrowBack className="mr-1" /> Back
            </button>
            <h3 className="text-lg font-semibold ml-3">Chat</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatLoading ? (
              <p className="text-center text-gray-500">Loading messages...</p>
            ) : chatError ? (
              <p className="text-red-500">Error loading messages.</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-500">No messages yet</p>
            ) : (
              messages.map((chat: { id: Key | null | undefined; senderTravel: { id: string; }; message: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                <div key={chat.id} className={`flex ${chat.senderTravel?.id === selectedTravelId ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-lg ${chat.senderTravel?.id === selectedTravelId ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                    <p className="text-sm">{chat.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">People in Room</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {usersInRoom.length === 0 ? (
              <p className="p-4 text-gray-500">No users in the room</p>
            ) : (
              usersInRoom.map((user: { id: Key | null | undefined; travel: { id: SetStateAction<string | null>; kyc: { path: string | undefined; }[]; firstName: string | undefined; lastName: any; }; }) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedTravelId(user.travel?.id)}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center"
                >
                  {user.travel?.kyc?.[0]?.path ? (
                    <img src={user.travel.kyc[0].path} alt={user.travel.firstName} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                  )}
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold">{user.travel ? `${user.travel.firstName} ${user.travel.lastName}` : "Unknown User"}</h4>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 text-center border-t border-gray-200">
            <button className="text-sm text-blue-600">View All Users</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
