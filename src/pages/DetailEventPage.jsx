import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button as HeroButton,
} from "@heroui/react";
import Card from "../components/elements/Card";
import ButtonFilled from "../components/elements/ButtonFilled";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { format } from "date-fns";
import axiosInstance from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import TaskForm from "../components/form/TaskForm";
import Swal from "sweetalert2";

const DetailEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const { getToken } = useAuth();
  const axios = axiosInstance(getToken);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventRes = await axios.get(`/event/${eventId}`);
        console.log("event details", eventRes.data);
        
        setEvent(eventRes.data);

        const tasksRes = await axios.get(`/event/${eventId}/tasks`);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error("Failed to fetch event details:", err);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleAddTask = async (formData) => {
    try {
      const newTaskData = { ...formData, eventId };
      const res = await axios.post(`/event/${eventId}/tasks`, newTaskData);
      setTasks((prev) => [...prev, res.data]);
      setIsAddingTask(false);
      Swal.fire({
        icon: "success",
        title: "Task Created",
        text: "Task Success Created",
        confirmButtonColor: "#3085d6"
      });
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleUpdateTask = async (updatedData) => {
    try {
      const res = await axios.put(
        `/event/${eventId}/tasks/${currentTask.id}`,
        updatedData
      );
      setTasks((prev) =>
        prev.map((task) => (task.id === currentTask.id ? res.data : task))
      );
      setIsEditingTask(false);
      setCurrentTask(null);
      Swal.fire({
        icon: "success",
        title: "Task Updated",
        text: "Task Success Updated",
        confirmButtonColor: "#3085d6"
      });
    } catch (err) {
      console.error("Failed to update task:", err);
        Swal.fire({
        icon: "success",
        title: "Error",
        text: "Failed Update Task",
        confirmButtonColor: "#d33"
      });
    }
  };

  // const handleDeleteTask = async (taskId) => {
  //   try {
  //     await axios.delete(`/event/${eventId}/tasks/${taskId}`);
  //     setTasks((prev) => prev.filter((task) => task.id !== taskId));
  //   } catch (err) {
  //     console.error("Failed to delete task:", err);
  //   }
  // };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) return;

    try {
      const updatedTask = { ...draggedTask, status: newStatus };
      await axios.patch(`/event/${eventId}/tasks/${draggedTask.id}`, {
        status: newStatus,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTask.id ? { ...task, status: newStatus } : task
        )
      );

      setDraggedTask(null);
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  if (!event) {
    return <div className="text-white">Loading event details...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <ButtonFilled
            variant="outline"
            onClick={() => navigate("/admin/event")}
            endContent={<FaArrowLeft />}
          >
            Back to Events
          </ButtonFilled>
          <h1 className="text-3xl font-bold text-white">{event.title}</h1>
        </div>
        <ButtonFilled
          color="outline"
          onClick={() => setIsAddingTask(true)}
          endContent={<FaPlus />}
        >
          Add Task
        </ButtonFilled>
      </div>

      <Card className="bg-gray-800 p-6">
        <h3 className="text-white font-medium mb-2">Event Details</h3>
        <p className="text-gray-400">{event.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-gray-500">Date</p>
            <p className="text-white">
              {format(new Date(event.date), "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="text-white">{event.location || "TBD"}</p>
          </div>
          <div>
            <p className="text-gray-500">Category</p>
            <p className="text-white">{event.MenuCategory.name || "No Category"}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["todo", "inProgress", "done"].map((status) => (
          <Card
            key={status}
            className="bg-gray-800 p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              {status === "todo"
                ? "To Do"
                : status === "inProgress"
                ? "In Progress"
                : "Done"}{" "}
              ({tasks.filter((task) => task.status === status).length})
            </h2>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <motion.div
                    key={task.id}
                    className="bg-gray-700 p-4 rounded-lg cursor-move"
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-white font-semibold">Tugas : {task.name}</h3>
                    <h2 className="text-white font-normal">Koordinator - {task.team}</h2>
                    <p className="text-gray-400 text-sm text-justify">{task.description}</p>
                    <p className="text-green-500 text-xs mt-2">
                      Jadwal-Mulai Task:{" "}
                      {task.startDate
                        ? format(new Date(task.startDate), "MMM dd, yyyy")
                        : "No start date"}
                    </p>
                    <p className="text-red-500 text-xs mt-2">
                      Jadwal-Akhir Task:{" "}
                      {task.endDate
                        ? format(new Date(task.endDate), "MMM dd, yyyy")
                        : "No start date"}
                    </p>
                    <div className="flex justify-between mt-4">
                      <HeroButton
                        variant="light"
                        onClick={() => {
                          setCurrentTask(task);
                          setIsEditingTask(true);
                        }}
                      >
                        Edit
                      </HeroButton>
                      {/* <HeroButton
                        variant="danger"
                        onPress={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </HeroButton> */}
                    </div>
                  </motion.div>
                ))}
              {tasks.filter((task) => task.status === status).length === 0 && (
                <p className="text-gray-500 text-center">No tasks here yet</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={isAddingTask} onClose={() => setIsAddingTask(false)}>
        <ModalContent>
          <ModalHeader>Add New Task</ModalHeader>
          <ModalBody>
            <TaskForm onSubmit={handleAddTask} />
          </ModalBody>
          <ModalFooter>
            <HeroButton variant="light" onClick={() => setIsAddingTask(false)}>
              Cancel
            </HeroButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditingTask} onClose={() => setIsEditingTask(false)}>
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalBody>
            <TaskForm onSubmit={handleUpdateTask} initialValues={currentTask} />
          </ModalBody>
          <ModalFooter>
            <HeroButton variant="light" onClick={() => setIsEditingTask(false)}>
              Cancel
            </HeroButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DetailEventPage;
