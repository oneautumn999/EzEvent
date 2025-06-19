import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ButtonFilled from "../components/elements/ButtonFilled";
import { useNavigate } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";
// import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const handleRegister = () => {
    navigate("/register");
  };

  const navigate = useNavigate();
  //   const { isSignedIn } = useUser();

  const handleGetStarted = () => {
    //   navigate("/dashboard");
    navigate("/login");
  };

  const features = [
    {
      icon: <FaCalendarAlt className="text-3xl text-purple-400" />,
      title: "Event Planning",
      description: "Create and manage your events with ease",
    },
    {
      icon: <FaUsers className="text-3xl text-blue-400" />,
      title: "Guest Management",
      description: "Track RSVPs and manage attendee lists",
    },
    {
      icon: <FaClock className="text-3xl text-green-400" />,
      title: "Timeline Tools",
      description: "Keep your events on schedule",
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-red-400" />,
      title: "Venue Selection",
      description: "Find and book the perfect venue",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-50" />
        <div className="absolute inset-0 bg-[url('/images/event-bg.jpg')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
          >
            Plan Your Perfect Event
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl"
          >
            Create unforgettable memories with our comprehensive event planning
            platform
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-x-4 flex justify-center items-center"
          >
            <ButtonFilled
              color="blue"
              onClick={handleGetStarted}
              className="text-lg px-6 py-2.5 hover:bg-blue-600 transition-all duration-300"
            >
              Sign In
            </ButtonFilled>
            <ButtonFilled
              color="green"
              onClick={handleRegister}
              className="text-lg px-6 py-2.5 hover:bg-green-600 transition-all duration-300"
            >
              Register
            </ButtonFilled>
          </motion.div>
        </div>
      </div>

      <div className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Everything You Need for Successful Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-gray-900 rounded-xl hover:bg-gray-700 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
