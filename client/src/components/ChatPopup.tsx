import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useState } from "react";
interface Chat{
  id:string;
  message: string;
  createdAt:string;
travel: Travel
}
interface Travel {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicleType: string;
  gender: string;
  kyc:Profile[]
}
interface Profile {
  id:string;
  path:string;
}
const ChatPopup = () => {
const [chats, setChats] = useState<Chat[]>([])
const {socket} = useSocket();

useEffect(()=>{
  socket.on("message",(messages) =>{
setChats(messages)
  })
})


  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Messages</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start space-x-3"
          >
            <img
              src={chat.travel.kyc[0].path}
              alt={chat.travel.firstName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold truncate">{chat.travel.firstName}</h4>
                <span className="text-xs text-gray-500">{chat.createdAt}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.message}</p>
            </div>
            {/* {chat.unread > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {chat.unread}
              </span>
            )} */}
          </div>
        ))}
      </div>
      <div className="p-3 text-center border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All Messages
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
