import { useState } from "react";
import {  useQuery } from "@apollo/client";
import { GET_ROOM_CHATS } from "@/mutation/queries";
import ChatMessages from "./ui/ChatMessage";
import { useNavigate } from "react-router-dom";

interface Details {
  id:string;
  firstName:string;
  middleName:string;
  lastName:string;
  role:string
}
const ChatPopup = () => {
  const [selectedTravelId, setSelectedTravelId] = useState<Details | null>(null);
  const { data, loading, error } = useQuery(GET_ROOM_CHATS);
  console.log("🚀 ~ ChatPopup ~ data:", data)
  const navigate = useNavigate()
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading chats.</p>;

  const usersInRoom = data?.getConnectedUsers || [];
const selectedDetails= (id:string, firstName:string, middleName:string, lastName:string, role:string) =>{
  const details = {id,firstName,middleName,lastName,role}
setSelectedTravelId(details)

}
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {selectedTravelId ? (
        <ChatMessages details={selectedTravelId} onBack={() => setSelectedTravelId(null) } />
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
                    {user.guide?selectedDetails(user.guide?.id, user.guide?.firstName, user.guide?.middleName, user.guide?.lastName, user.guide?.role):selectedDetails(user.travel?.id, user.travel?.firstName, user.travel?.middleName, user.travel?.lastName, user.travel?.role )}
                  }}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start space-x-3"
                >
                  {user.travel?.kyc?.[0]?.path ? (
                    <img
                      src={user?.travel?.kyc[0]?.path}
                      alt={user.travel.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div>
                      {user.guide ?.kyc?.[0]?.path?(
                         <img
                         src={user?.guide?.kyc[0]?.path}
                         alt={user.guide.firstName}
                         className="w-10 h-10 rounded-full"
                       />
                      ):(

                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">
                      {user.travel
                        ? `${user.travel.firstName} ${user.travel.lastName} (${user.travel.role}) `
                        : user.guide? `${user.guide.firstName} ${user.guide.lastName} (${user.guide.role})`:"Unknown User"}
                    </h4>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 text-center border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-800" onClick={()=>navigate('/chat')}>
              View All Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export default ChatPopup;
