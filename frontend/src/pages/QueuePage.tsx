import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function QueuePage() {
    const [position, setPosition] = useState(null);
    const [userId, setUserId] = useState(null);
    const ws = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const enqueueUser = async () => {
            try {
                const { data } = await axios.post('http://localhost:5000/enqueue');
                setUserId(data.userId);
                setPosition(data.position);
            } catch (error) {
                console.error('Error while entering queue:', error);
            }
        };

        // Only enqueue the user if they don't already have a userId
        if (!userId) {
            enqueueUser();
        }

        // Initialize WebSocket connection to receive updates
        ws.current = new WebSocket('ws://localhost:8080');
        ws.current.onmessage = (event) => {
            const updatedQueue = JSON.parse(event.data);
            const userEntry = updatedQueue.find((entry) => entry.value === userId);

            if (userEntry) {
                const newPosition = updatedQueue.indexOf(userEntry) + 1; // Update position based on the new queue
                setPosition(newPosition);
                if (newPosition === 1) {
                    navigate('/seat-selection'); // Redirect to seat selection when position is 1
                }
            }
        };

        return () => {
            ws.current.close(); // Clean up WebSocket connection on unmount
        };
    }, [userId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="relative h-48 bg-cover bg-center" style={{backgroundImage: "url('/placeholder.svg?height=200&width=800')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold mb-2">Coldplay</h1>
            <p className="text-white text-xl">Music Of The Spheres World Tour</p>
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4">You've Been Added To The Queue...</h2>
          <div className="bg-purple-600 rounded-lg p-4 mb-4">
            <p className="text-4xl font-bold mb-2">{position !== null ? (
                <p>{position} people ahead of you</p>
            ) : (
                <p>Joining the queue...</p>
            )}</p>
          </div>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>When it's your turn, you'll have 10 minutes to enter the Ticketmaster site</li>
            <li>Don't refresh this page - it will update automatically</li>
            <li>If you leave the queue, you'll lose your place</li>
            <li>Ticket availability is limited and not guaranteed</li>
          </ul>
        </div>
      </main>
    </div>
  )
}