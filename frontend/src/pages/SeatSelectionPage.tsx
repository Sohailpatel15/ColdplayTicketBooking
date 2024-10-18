import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronDown, Info } from 'lucide-react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SeatSelectionPage() {
  const [state, setState] = useState('Maharashtra')
  const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(async () => {
            // Auto dequeue after 3 seconds if the user hasn't selected the seat
            await axios.post(`http://localhost:5000/seat-selection/${localStorage.getItem('userId')}`);
            alert('Time up! You were dequeued.');
            navigate('/');
        }, 3000); // 3 seconds timeout

        return () => clearTimeout(timer);
    }, [navigate]);

    const handleBookSeat = async () => {
        await axios.post(`http://localhost:5000/seat-selection/${localStorage.getItem('userId')}`);
        alert('Seat booked successfully!');
        navigate('/');
    };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <ChevronLeft className="w-6 h-6 text-gray-500 mr-4" />
          <img src="/placeholder.svg?height=30&width=120" alt="BookMyShow" className="h-8" />
        </div>
        <h1 className="text-xl font-semibold">Ticket options</h1>
        <div className="w-6"></div>
      </header>

      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Please select from the following option(s)</h2>
          <div className="flex items-center mb-4">
            <input type="radio" id="pickup" name="ticketOption" className="w-4 h-4 text-red-600" checked />
            <label htmlFor="pickup" className="ml-2">Pickup from Box-Office</label>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Pickup Information</h3>
            <p className="text-sm mb-2">Pickup address will be communicated to you via Email or SMS shortly</p>
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li>Customer(s) will receive an order confirmation via email, which must be presented at the pick up counter to collect your ticket(s).</li>
              <li>Cardholder should be present, with the card used at the time of booking, at the counter to collect the ticket(s) (In case the card holder cannot collect tickets, the proxy must carry a photocopy of the card along with an authorization letter).</li>
            </ol>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="font-semibold">Sunburn Arena Ft. Alan Walker - Mumbai</h2>
            <p className="text-sm text-gray-500">1 Ticket</p>
            <p className="font-semibold mt-2">₹2,500.00</p>
            <p className="text-sm">Sat, 19 Oct, 2024</p>
            <p className="text-sm">04:00 PM</p>
            <p className="text-sm mt-2">Venue</p>
            <p className="text-sm">R2 Grounds, MMRDA: Mumbai</p>
            <p className="text-sm mt-2">GA Phase 4(2500): 1 ticket(s)</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sub-total</span>
              <span>₹2,500.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Booking Fee</span>
              <div className="flex items-center">
                <span className="mr-1">₹177.00</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₹2,677.00</span>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">Select State</label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>Maharashtra</option>
            </select>
          </div>

          <div className="flex items-start mt-4">
            <Info className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500">By proceeding, I express my consent to complete this transaction.</p>
          </div>

          <button className="w-full bg-pink-500 text-white py-3 rounded-md mt-4 hover:bg-pink-600 transition duration-300" onClick={handleBookSeat}>
            Book
          </button>
        </div>
      </main>
    </div>
  )
}