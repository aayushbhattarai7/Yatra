import { useQuery } from "@apollo/client";
import { GET_CHAT_COUNT_OF_USER_BY_TRAVEL, GET_CHAT_COUNT_OF_USER_BY_GUIDE } from "../mutation/queries";
import { useSocket } from "../contexts/SocketContext";
import { useEffect, useState, useCallback } from "react";
import { getCookie } from "../function/GetCookie";
import { jwtDecode } from "jwt-decode";

const UnreadChatBadge = ({ id }: { id: string}) => {
    const [unread, setUnread] = useState<number>(0);
    const token = getCookie("accessToken")
    const decodedToken:any = jwtDecode(token!)
    const query = decodedToken.role === "TRAVEL" ? GET_CHAT_COUNT_OF_USER_BY_TRAVEL : GET_CHAT_COUNT_OF_USER_BY_GUIDE;
    
    const { data, error } = useQuery(query, { variables: { id }, fetchPolicy:"network-only" });
    console.log("🚀 ~ UnreadChatBadge ~ data:", data)
    const { socket } = useSocket();

    const updateUnread = useCallback((newCount: number) => {
        setUnread(newCount);
    }, []);

    useEffect(() => {
        if (data) {
            const count = decodedToken.role === "GUIDE" 
            ? data?.getChatCountOfUserByGuide 
            : data?.getChatCountOfUserByTravel;
            setUnread(count || 0);
        }
    }, [data, decodedToken.role]);

    useEffect(() => {
        const handleChatCount = (payload: { id: string; chatCounts: number }) => {
            console.log("🚀 ~ handleChatCount ~ id:", payload,"------------------",id)
            if (payload.id === id) {
                updateUnread(payload.chatCounts);
            }
        };
        socket.on("chat-count-of-user", handleChatCount);
        return () => {
            socket.off("chat-count-of-user", handleChatCount);
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