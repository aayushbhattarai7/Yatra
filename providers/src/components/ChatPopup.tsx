import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import ChatMessages from "./ChatMessage";
import { GET_USER_FOR_CHAT, GET_USER_FOR_CHAT_BY_GUIDE } from "../mutation/queries";
import { getCookie } from "../function/GetCookie";
import { jwtDecode } from "jwt-decode";
interface Room{
id:string;
user:{
  id:string;
  firstName:string;
  middleName:string;
  lastName:string;
  gender:string;
}
travel:{
  id:string;
  firstName:string;
  middleName:string;
  lastName:string;
  gender:string;
}
}

const ChatPopup = () => {
  const token = getCookie("accessToken")
  const decodedToken:any = jwtDecode(token!)
  const query = decodedToken.role==="TRAVEL"?GET_USER_FOR_CHAT:GET_USER_FOR_CHAT_BY_GUIDE
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data } = useQuery(query);
  const [userInRoom, setUserInRoom] = useState<Room[]>([])

  useEffect(()=>{
    if(decodedToken.role === "TRAVEL"){
      if(data?.getChatUserByTravel) setUserInRoom(data?.getChatUserByTravel)
    }else{
  if(data?.getChatUserByGuide) setUserInRoom(data?.getChatUserByGuide)
  }
  },[data?.getChatUserByTravel, data?.getChatUserByGuide])


  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {selectedUserId ? (
        <ChatMessages userId={selectedUserId} onBack={() => setSelectedUserId(null)} />
      ) : (
        <div>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">People</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {userInRoom?.length === 0 ? (

              <p className="p-4 text-gray-500">No users in the room</p>
            ) : (
              userInRoom?.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedUserId(room.user?.id)}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start space-x-3"
                >
                  {/* <p>{room.id}</p> */}
                  {/* {room.user?.kyc?.[0]?.path ? (
                    <img
                      src={room.user.kyc[0].path}
                      alt={room.user.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                  )} */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">
                      {room.user
                        ? `${room.user.firstName} ${room.user.lastName}`
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
