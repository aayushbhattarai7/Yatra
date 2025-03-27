import { useQuery } from "@apollo/client";
import { GET_CHAT_COUNT_OF_GUIDE, GET_CHAT_COUNT_OF_TRAVEL } from "@/mutation/queries";


const UnreadChatBadge = ({ id, role }: { id: string, role: string }) => {
    const query = role === "TRAVEL" ? GET_CHAT_COUNT_OF_TRAVEL : GET_CHAT_COUNT_OF_GUIDE;

    const { data, error } = useQuery(query, {
        variables: { id },
    });

    if (error) console.log(error);
    console.log("Selected query:", query);
    console.log("Query variables:", { id });

    const getCounts = role === "GUIDE" ? data?.getChatCountOfGuide : data?.getChatCountOfTravel;
    const unreadCount = getCounts || 0;

    return unreadCount > 0 ? (
        <span className="ml-2 text-xs text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full">
            {unreadCount}
        </span>
    ) : null;
};


export default UnreadChatBadge;
