import { gql, useMutation, useQuery } from "@apollo/client";
import { Trash2, Loader2, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { showToast } from "../ToastNotification";
import { useSocket } from "@/contexts/SocketContext";

const GET_SUPPORT_MESSAGES = gql`
  query GetSupportMessages {
    getSupportMessages {
      id
      message
      name
      email
      createdAt
    }
  }
`;

const DELETE_SUPPORT_MESSAGE = gql`
  mutation DeleteSupportMessage($deleteSupportMessageId: String!) {
    deleteSupportMessage(id: $deleteSupportMessageId)
  }
`;

interface SupportMessage {
    id: string;
    message: string;
    name: string;
    email: string;
    createdAt: string;
}

const AdminSupport = () => {
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const { socket } = useSocket();
    const { data, loading, refetch } = useQuery(GET_SUPPORT_MESSAGES);
    const [deleteSupportMessage, { loading: deleteLoading }] = useMutation(DELETE_SUPPORT_MESSAGE);
    const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([])

    useEffect(() => {
        if (data?.getSupportMessages) {
            setSupportMessages(data.getSupportMessages)
        }
    }, [data])

    useEffect(() => {
        socket.on("support", (message: SupportMessage) => {
            setSupportMessages((prev) => [message, ...prev]);
        });
        
        return () => {
            socket.off("support")
        }
    }, [socket])
    const handleDelete = async (id: string) => {
        try {
            setSelectedMessage(id);
            await deleteSupportMessage({
                variables: { deleteSupportMessageId: id },
            });
            await refetch();
            showToast("Message deleted successfully", "success");
        } catch (error) {
            showToast("Failed to delete message", "error");
        } finally {
            setSelectedMessage(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Support Messages</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {supportMessages.map((message: SupportMessage) => (
                        <div
                            key={message.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {message.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{message.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(message.id)}
                                        disabled={deleteLoading && selectedMessage === message.id}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        {deleteLoading && selectedMessage === message.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                <p className="text-gray-700 mb-4 line-clamp-3">
                                    {message.message}
                                </p>

                                <div className="text-sm text-gray-500">
                                    {formatDate(message.createdAt)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {data?.getSupportMessages.length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No messages yet
                        </h3>
                        <p className="text-gray-500">
                            Support messages will appear here when users send them.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSupport;