import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ROOM_CHATS } from "@/mutation/queries";
import ChatMessages from "./ui/ChatMessage";
import { useNavigate } from "react-router-dom";
import UnreadChatBadge from "./UnreadChatBadge";
import { useSocket } from "@/contexts/SocketContext";

interface Details {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
}
const ChatPopup = () => {
  const { socket } = useSocket();
  const [selectedTravelId, setSelectedTravelId] = useState<Details | null>(null);
  const { data, loading, error, refetch } = useQuery(GET_ROOM_CHATS);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("chat-count-of-guide", () => {
      refetch();
    });
    socket.on("chat-count-of-travel", () => {
      refetch();
    });
    return () => {
      socket.off("chat-count-of-guide");
      socket.off("chat-count-of-travel");
    };
  }, [socket]);

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

  const usersInRoom = data?.getConnectedUsers || [];

  const selectedDetails = (
    id: string,
    firstName: string,
    middleName: string,
    lastName: string,
    role: string,
  ) => {
    const details = { id, firstName, middleName, lastName, role };
    setSelectedTravelId(details);
    socket.emit("mark-as-read", { senderId: details.id, role: details.role });
  };

  const onBack = () => {
    setSelectedTravelId(null)
    refetch()
  }
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {selectedTravelId ? (
        <ChatMessages
          details={selectedTravelId}
          onBack={() => onBack()}
        />
      ) : (
        <div>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">People in Room</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {usersInRoom.length === 0 ? (
              <p className="p-4 text-gray-500">No users in the room</p>
            ) : (
              usersInRoom.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => {
                    user.guide
                      ? selectedDetails(
                          user.guide?.id,
                          user.guide?.firstName,
                          user.guide?.middleName,
                          user.guide?.lastName,
                          user.guide?.role,
                        )
                      : selectedDetails(
                          user.travel?.id,
                          user.travel?.firstName,
                          user.travel?.middleName,
                          user.travel?.lastName,
                          user.travel?.role,
                        );
                  }}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start space-x-3"
                >
                  {user.travel?.kyc?.[0]?.path ? (
                    <img
                      src={user?.travel?.kyc[0]?.path}
                      alt={user.travel.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : user.guide?.kyc?.[0]?.path ? (
                    <img
                      src={user?.guide?.kyc[0]?.path}
                      alt={user.guide.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">
                      {user.travel
                        ? `${user.travel.firstName} ${user.travel.lastName} (${user.travel.role}) `
                        : user.guide
                        ? `${user.guide.firstName} ${user.guide.lastName} (${user.guide.role})`
                        : "Unknown User"}
                      {user.guide ? (
                        <UnreadChatBadge id={user.guide.id} role={user.guide.role} />
                      ) : (
                        <UnreadChatBadge id={user.travel.id} role={user.travel.role} />
                      )}
                    </h4>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 text-center border-t border-gray-200">
            <button
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => navigate("/chat")}
            >
              View All Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
