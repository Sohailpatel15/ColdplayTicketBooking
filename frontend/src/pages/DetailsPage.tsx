import { useState } from 'react'
import { Search, Menu } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select } from "../components/ui/select"
import logo from '../assets/logo2.png';
import poster from "../assets/poster.png"
import { useNavigate } from 'react-router-dom';
// import Image from "next/image"

export default function DetailsPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    "/placeholder.svg?height=400&width=1200",
    "/placeholder.svg?height=400&width=1200",
    "/placeholder.svg?height=400&width=1200"
  ]


    const navigate = useNavigate();

    const handleEnterQueue = () => {
        navigate('/queue');
    };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* <Image src="/placeholder.svg?height=40&width=150" alt="BookMyShow" width={150} height={40} /> */}
              <img 
                src={logo} // Relative path to your image
                alt="logo" 
                width={100} // Set width
                height= {100} // Set height
              />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search for Movies, Events, Plays, Sports and Activities" 
                className="pl-10 w-[400px]" 
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select>
              <option>Mumbai</option>
            </Select>
            <Button>Sign in</Button>
            <Menu className="text-gray-600" />
          </div>
        </div>
      </header>

      <nav className="border-b">
        <div className="container mx-auto px-4 py-2">
          <ul className="flex space-x-6">
            <li className="text-gray-700 hover:text-primary cursor-pointer">Movies</li>
            <li className="text-gray-700 hover:text-primary cursor-pointer">Stream</li>
            <li className="text-gray-700 hover:text-primary cursor-pointer">Events</li>
            <li className="text-gray-700 hover:text-primary cursor-pointer">Plays</li>
            <li className="text-gray-700 hover:text-primary cursor-pointer">Sports</li>
            <li className="text-gray-700 hover:text-primary cursor-pointer">Activities</li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="relative">
            <img 
            src={poster} // Relative path to your image
            alt="Event Banner" 
            width={800} // Set width
            height={800} // Set height
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button 
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-300'}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Sunburn Arena Ft. Alan Walker - Mumbai</h1>
              <p className="text-gray-600">EDM | English | 3yrs + | 6hrs</p>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-lg font-semibold">Sat 19 Oct 2024 at 4:00 PM</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">FILLING FAST</span>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span>R2 Grounds, MMRDA: Mumbai</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold">₹ 1,000</span> onwards
              </div>
            </div>
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white " onClick={handleEnterQueue}>Book</Button>
          </div>
        </div>
      </main>
    </div>
  )
}