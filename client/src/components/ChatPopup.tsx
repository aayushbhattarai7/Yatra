import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ROOM_CHATS } from "@/mutation/queries";
import ChatMessages from "./ui/ChatMessage";


const ChatPopup = () => {
  const [selectedTravelId, setSelectedTravelId] = useState<string | null>(null);
  const { data, loading, error } = useQuery(GET_ROOM_CHATS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading chats.</p>;

  const usersInRoom = data?.getConnectedUsers || [];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {selectedTravelId ? (
        <ChatMessages travelId={selectedTravelId} onBack={() => setSelectedTravelId(null)} />
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
                  onClick={() => setSelectedTravelId(user.travel?.id)}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start space-x-3"
                >
                  {user.travel?.kyc?.[0]?.path ? (
                    <img
                      src={user.travel.kyc[0].path}
                      alt={user.travel.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">
                      {user.travel
                        ? `${user.travel.firstName} ${user.travel.lastName}`
                        : "Unknown User"}
                    </h4>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 text-center border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export default ChatPopup;
