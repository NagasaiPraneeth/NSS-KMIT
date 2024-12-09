import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const EventPage = () => {
  const navigate = useNavigate();
  const { id, duration } = useParams();
  const [eventid,setEventId]=useState(id)
  const [eventduration,setDuration]=useState(duration)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [volunteers,setVolunteers]=useState()
  const [event, setEvents] = useState([]);
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    rollno: '',
    photoUrl: '',
    eventid: eventid,
    duration: eventduration,
  });

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    newVolunteer.eventid=eventid;
    newVolunteer.duration=eventduration;
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/en/addvolunteer`, newVolunteer);
    console.log(response.data.data)
    navigate(0)
    
    setNewVolunteer({ name: '', role: '', photoUrl: '' });
    setIsModalOpen(false);
    
  };

  useEffect(() => {
    getVolunteers();
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

  const getVolunteers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/en/getVolunteers/${eventid}`);
      console.log(response.data);
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error loading PDF:', error);
  }
};

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8
    }
  };

  return( volunteers && event &&(
    <div className="min-h-screen bg-gray-50">
      {/* Hero Title Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-base sm:text-lg">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👤</span>
                <span>NSSCOMMITTE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Description Section */}
      <motion.section 
        className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-4 sm:p-8 prose prose-sm sm:prose-lg max-w-none"
          variants={itemVariants}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">About the Event</h2>
          {event.description}
        </motion.div>
      </motion.section>

      {/* Volunteers Section */}
      <motion.section 
        className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Our Amazing Volunteers</h2>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>+</span>
            <span>Add Volunteer</span>
          </motion.button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {volunteers.map((volunteer) => (
            <motion.div
              key={volunteer.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
            >
              <div className="p-4 sm:p-6 flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {volunteer.photoUrl ? (
                    <img 
                      src={volunteer.photoUrl} 
                      alt={volunteer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-semibold text-lg">
                      {getInitials(volunteer.name)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl mb-1 group-hover:text-blue-600 transition-colors">
                    {volunteer.name}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">{volunteer.rollno}</p>
                </div>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Add Volunteer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Add New Volunteer</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newVolunteer.name}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={newVolunteer.role}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Photo URL (optional)</label>
                  <input
                    type="text"
                    value={newVolunteer.photoUrl}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave empty for default avatar"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Volunteer
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Back to Events Button */}
      <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8">
        <motion.button
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>←</span>
          <span>Back to Events</span>
        </motion.button>
      </div>
    </div>
  )
  );

};

export default EventPage;