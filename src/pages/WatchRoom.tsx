import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { getMovieDetails } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';

interface Movie {
  id: number;
  title: string;
}

interface ChatMessage {
  user: string;
  message: string;
  timestamp: number;
}

const WatchRoom = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [viewers, setViewers] = useState<string[]>([]);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await getMovieDetails(id!);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };

    fetchMovieData();

    // Connect to WebSocket server
    const newSocket = io('http://localhost:3001', {
      query: { roomId: id, userId: user?.email },
    });

    newSocket.on('message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('viewersUpdate', (updatedViewers: string[]) => {
      setViewers(updatedViewers);
    });

    setSocket(newSocket);
    setInviteLink(`${window.location.origin}/watch/${id}`);

    return () => {
      newSocket.disconnect();
    };
  }, [id, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const message: ChatMessage = {
        user: user?.email || 'Anonymous',
        message: newMessage.trim(),
        timestamp: Date.now(),
      };
      socket.emit('message', message);
      setNewMessage('');
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg mb-4">
              {/* Add your video player component here */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Video player placeholder for: {movie?.title}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">{movie?.title}</h1>
              <button
                onClick={copyInviteLink}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
              >
                Share Invite Link
              </button>
            </div>
          </div>

          {/* Chat and Viewers */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Viewers ({viewers.length})</h2>
              <div className="space-y-2">
                {viewers.map((viewer, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">{viewer}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-700 my-4"></div>

            <div className="flex flex-col h-96">
              <h2 className="text-lg font-semibold mb-2">Chat</h2>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg, index) => (
                  <div key={index} className="break-words">
                    <span className="font-medium text-blue-400">{msg.user}: </span>
                    <span className="text-gray-300">{msg.message}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="mt-auto">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchRoom;
