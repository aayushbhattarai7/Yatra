import React from "react";

const ChatPopup = () => {
  const chats = [
    {
      id: 1,
      name: "Travel Support",
      message: "How can I help you today?",
      time: "2m ago",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      unread: 1,
    },
    {
      id: 2,
      name: "Tour Guide - Paris",
      message: "Your tour is scheduled for tomorrow at 9 AM",
      time: "1h ago",
      avatar:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      unread: 0,
    },
  ];

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
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold truncate">{chat.name}</h4>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.message}</p>
            </div>
            {chat.unread > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {chat.unread}
              </span>
            )}
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
