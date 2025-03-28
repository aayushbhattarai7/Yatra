import { useQuery } from "@apollo/client";
import { GET_CHAT_COUNT_OF_GUIDE, GET_CHAT_COUNT_OF_TRAVEL } from "@/mutation/queries";
import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useState, useCallback } from "react";

const UnreadChatBadge = ({ id, role }: { id: string, role: string }) => {
    const [unread, setUnread] = useState<number>(0);
    const query = role === "TRAVEL" ? GET_CHAT_COUNT_OF_TRAVEL : GET_CHAT_COUNT_OF_GUIDE;
    
    const { data, error, refetch } = useQuery(query, { variables: { id } });
    const { socket } = useSocket();

    const updateUnread = useCallback((newCount: number) => {
        setUnread(newCount);
    }, []);

    useEffect(() => {
        if (data) {
            const count = role === "GUIDE" 
                ? data?.getChatCountOfGuide 
                : data?.getChatCountOfTravel;
            setUnread(count || 0);
        }
    }, [data, role]);

    useEffect(() => {
        const handleChatCount = (payload: { id: string; chatCounts: number }) => {
            console.log("🚀 ~ handlechatCounts ~ chatCounts:", payload.chatCounts)

            console.log("🚀 ~ handlechatCounts ~ payload:", payload.id)
            if (payload.id === id) {
                updateUnread(payload.chatCounts);
            }
            refetch()
        };
        socket.on("chat-count-of-guide", handleChatCount);
        socket.on("chat-count-of-travel", handleChatCount);
        return () => {
            socket.off("chat-count-of-travel", handleChatCount);
            socket.off("chat-count-of-guide", handleChatCount);
        };
    }, [socket, id, updateUnread]); 

    if (error) console.error(error);

    return unread > 0 ? (
        <span className="ml-2 text-xs text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full">
            {unread}
        </span>
    ) : null;
};

export default UnreadChatBadge;