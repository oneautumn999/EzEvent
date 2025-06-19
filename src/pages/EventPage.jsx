import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button as HeroButton,
  Input,
} from "@heroui/react";
import { FaPlus } from "react-icons/fa";
import ButtonFilled from "../components/elements/ButtonFilled";
import Card from "../components/elements/Card";
import EventForm from "../components/form/EventForm";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axiosInstance from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
// import SearchBar from "../components/elements/SeachBar";
import Swal from "sweetalert2";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const axios = axiosInstance(getToken);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/event");
      const eventList = res.data || [];
      setEvents(eventList);
      setFilteredEvents(eventList);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvent = async (data) => {
    try {
      await axios.post("/event", {
        ...data,
        statusEvent: data.statusEvent || "open",
      });
      setIsAddingEvent(false);
      fetchEvents();
      Swal.fire({
        icon: "success",
        title: "Event Created",
        text: "Event Success Created",
        confirmButtonColor: "#3085d6"
      });
    } catch (err) {
      console.error(err);
      setError("Failed to submit event.");
    }
  };

  const handleUpdateEvent = async (id, updatedData) => {
    try {
      await axios.put(`/event/${id}`, updatedData);
      setIsEditingEvent(false);
      fetchEvents();
      Swal.fire({
        icon: "success",
        title: "Event Updated",
        text: "Event Success Updated",
        confirmButtonColor: "#3085d6"
      });
    } catch (err) {
      console.error("Failed to update event:", err);
      setError("Failed to update event.");
    }
  };

  const handleDeleteEvent = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/event/${id}`);
        fetchEvents();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The event has been deleted successfully.",
          confirmButtonColor: "#3085d6",
        });
      } catch (err) {
        console.error("Failed to delete event:", err);
        setError("Failed to delete event.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete the event. Please try again.",
          confirmButtonColor: "#d33",
        });
      }
    }
  });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    navigate(`/admin/event/${event.id}`);
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setIsEditingEvent(true);
  };

  const handleEditSubmit = (updatedData) => {
    handleUpdateEvent(currentEvent.id, updatedData);
  };

  useEffect(() => {
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Event Planning Board</h1>
        <ButtonFilled
          onClick={() => setIsAddingEvent(true)}
          endContent={<FaPlus />}
        >
          Add Event
        </ButtonFilled>
      </div>

      <Input
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-gray-700 text-white"
        clearable
      />

      {error && <p className="text-red-400">{error}</p>}

      <Card>
        <h3 className="text-white font-medium mb-4">Your Events</h3>
        {loading ? (
          <p className="text-gray-400">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
              >
                <h4 className="text-white font-medium">{event.name}</h4>
                <p className="text-gray-400 text-sm mt-1">
                  {event.description}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Date: {format(new Date(event.date), "MMM dd, yyyy")}
                </p>
                <p className="text-gray-500 text-xs">
                  Status: {event.statusEvent}
                </p>
                <div className="flex gap-2 mt-4">
                  <ButtonFilled
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(event);
                    }}
                    color="gray"
                  >
                    Edit
                  </ButtonFilled>
                  <ButtonFilled
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                  >
                    Delete
                  </ButtonFilled>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="col-span-3 text-center text-gray-400 py-10">
                No Events Found
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddingEvent}
        onClose={() => setIsAddingEvent(false)}
        backdrop="blur"
        className="modal-content"
        overlayclass="modal-overlay"
        style={{
          width: "90%",
          maxWidth: "600px",
          height: "auto",
          maxHeight: "90%",
          overflowY: "auto",
          margin: "0 auto",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-white">Add New Event</ModalHeader>
          <ModalBody>
            <EventForm onSubmit={handleSubmitEvent} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditingEvent}
        onClose={() => setIsEditingEvent(false)}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="text-white">Edit Event</ModalHeader>
          <ModalBody>
            <EventForm
              onSubmit={handleEditSubmit}
              initialValues={currentEvent}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EventPage;
