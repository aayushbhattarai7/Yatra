import {
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  Star,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"
import { homeImage } from "@/config/constant/image"
import { authLabel } from "@/localization/auth"
import { useLang } from "@/hooks/useLang"

function UserHome() {
  const { lang } = useLang()

  const topPlaces = [
    {
      id: 1,
      name: "Everest Base Camp",
      location: "Nepal",
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400",
      description: "Experience the majesty of the world's highest peak with our guided trek to Everest Base Camp.",
    },
    {
      id: 2,
      name: "Annapurna Circuit",
      location: "Nepal",
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400",
      description: "Trek through diverse landscapes and traditional villages on this classic Himalayan adventure.",
    },
    {
      id: 3,
      name: "Inca Trail",
      location: "Peru",
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=400",
      description: "Follow ancient pathways to the mystical ruins of Machu Picchu on this iconic trek.",
    },
  ]

  const topTravels = [
    {
      id: 1,
      name: "Himalayan Explorer",
      duration: "14 days",
      difficulty: "Moderate",
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400",
      price: "$1,899",
    },
    {
      id: 2,
      name: "Alpine Adventure",
      duration: "7 days",
      difficulty: "Easy",
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=400",
      price: "$1,299",
    },
    {
      id: 3,
      name: "Rainforest Expedition",
      duration: "10 days",
      difficulty: "Challenging",
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400",
      price: "$1,599",
    },
  ]

  const topGuides = [
    {
      id: 1,
      name: "Mingma Sherpa",
      specialty: "High Altitude Trekking",
      experience: "15 years",
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=200",
      trips: 120,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      specialty: "Wildlife & Nature",
      experience: "8 years",
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=200",
      trips: 87,
    },
    {
      id: 3,
      name: "Carlos Mendez",
      specialty: "Cultural Expeditions",
      experience: "12 years",
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=200",
      trips: 104,
    },
  ]

  return (
    <div className="relative">
      <div className="relative h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${homeImage})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">{authLabel.homeSlogan[lang]}</h1>
          <p className="text-xl text-center mb-8 max-w-2xl">{authLabel.homeSmallSlogan[lang]}</p>
        </div>
      </div>

 

      <div className="h-32"></div>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Top Destinations</h2>
          <a href="#" className="text-green-500 hover:text-green-600 flex items-center gap-1 font-medium">
            View all <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{place.name}</h3>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{place.rating}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-3">{place.location}</p>
                <p className="text-gray-600 mb-4">{place.description}</p>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Popular Treks</h2>
          <a href="#" className="text-green-500 hover:text-green-600 flex items-center gap-1 font-medium">
            View all <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topTravels.map((travel) => (
            <div
              key={travel.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={travel.image || "/placeholder.svg"}
                  alt={travel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full font-bold text-green-600">
                  {travel.price}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{travel.name}</h3>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{travel.rating}</span>
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium text-gray-700">{travel.duration}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Difficulty:</span>
                    <p className="font-medium text-gray-700">{travel.difficulty}</p>
                  </div>
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Expert Guides</h2>
          <a href="#" className="text-green-500 hover:text-green-600 flex items-center gap-1 font-medium">
            View all <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="h-32 w-32 rounded-full overflow-hidden mb-4 border-4 border-green-100">
                  <img
                    src={guide.image || "/placeholder.svg"}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{guide.name}</h3>
                <p className="text-green-600 font-medium mb-2">{guide.specialty}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">
                    {guide.rating} • {guide.experience} experience
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Completed {guide.trips} trips</p>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors mt-4">
                  Book This Guide
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-20">
        <div className="absolute inset-0 bg-green-700 opacity-90"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(/placeholder.svg?height=600&width=1200)`,
          }}
        ></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of travelers who have experienced the world's most breathtaking treks with our expert guides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
              Plan Your Trek
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
              Become a Guide
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">TrekGuide</h3>
              <p className="text-gray-300 mb-4">
                Connecting adventurers with expert guides for unforgettable trekking experiences around the world.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Destinations</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Himalayan Treks
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    European Alps
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    South American Trails
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    African Safaris
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Asian Adventures
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Our Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">support@trekguide.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">+1 (800) 123-4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">123 Adventure Way, Mountain View, CA 94043</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} TrekGuide. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserHome
