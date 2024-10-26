import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    duration: '',
    description: ''
  });
  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
      try {
        console.log("hi")
        const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/en/getEvents`);
        console.log(response.data);
        setEvents(response.data);
      } catch (error) {
        console.error('Error loading PDF:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log(`${import.meta.env.VITE_BACKEND_URL}/en/addEvent`);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/en/addEvent`, formData);
      console.log(response.data.data)
      navigate(0);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        date: '',
        location: '',
        duration: '',
        description: ''
      });
      setIsOpen(false);
    } catch (error) {
      console.log("error", error);
      // You might want to show an error message to the user here
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const [events, setEvents] = useState([
  //   {
  //     id: 1,
  //     title: "Blood Donation Camp",
  //     date: "2024-11-01",
  //     description: "Join us for our annual blood donation camp in partnership with the Red Cross.",
  //     image: "/api/placeholder/400/200",
  //   },
  //   {
  //     id: 2,
  //     title: "Tree Plantation Drive",
  //     date: "2024-11-15",
  //     description: "Help us make our community greener by participating in our tree plantation initiative.",
  //     image: "/api/placeholder/400/200",
  //   }
  // ]);

  const handleEventClick = (event) => {
    navigate(`/Event/${event._id}/duration=${event.duration}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Rest of your JSX remains exactly the same */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="h-16 w-16 bg-white rounded-full">
                {/* Logo placeholder */}
              </div>
              <h1 className="text-4xl font-bold">National Social Service</h1>
              <p className="text-xl text-blue-100">Not Me But You</p>
            </div>
            <button onClick={() => setIsOpen(true)} className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center">
              <span className="mr-2">+</span>
              Add New Event
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 p-6 bg-blue-50 rounded-lg">
              <div className="h-8 w-8 text-blue-600">📅</div>
              <div>
                <h3 className="font-semibold">Events Completed</h3>
                <p className="text-2xl font-bold">50+</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-green-50 rounded-lg">
              <div className="h-8 w-8 text-green-600">👥</div>
              <div>
                <h3 className="font-semibold">Volunteers</h3>
                <p className="text-2xl font-bold">200+</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-red-50 rounded-lg">
              <div className="h-8 w-8 text-red-600">❤️</div>
              <div>
                <h3 className="font-semibold">Lives Impacted</h3>
                <p className="text-2xl font-bold">1000+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div onClick={() => handleEventClick(event)} key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal Content */}
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Event</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <input
                  required
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Location
                </label>
                <input
                  required
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (hours)
                </label>
                <input
                  required
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Enter duration in hours"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p>Email: nss@example.com</p>
              <p>Phone: +1234567890</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>About NSS</li>
                <li>Our Mission</li>
                <li>Join as Volunteer</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <span>🔗</span>
                <span>🔗</span>
                <span>🔗</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;