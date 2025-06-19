import React, { useState, useEffect } from "react";
import FormComponent from "../elements/FormContainer";
import axiosInstance from "../../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import { color } from "framer-motion";

const EventForm = ({ onSubmit, initialValues = {} }) => {
  const [formValues, setFormValues] = useState({
    name: initialValues.name || "",
    description: initialValues.description || "",
    date: initialValues.date || "",
    location: initialValues.location || "",
    qty: initialValues.qty || "",
    price: initialValues.price || "",
    categoryId: initialValues.categoryId || "",
    invitedUsers: initialValues.invitedUsers || [],
    statusEvent: initialValues.statusEvent || "open",
    images: initialValues.images || "",
  });

  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const { getToken } = useAuth();
  const axios = axiosInstance(getToken);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/category");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const allUsers = await axios.get("/user");
        setUsers(allUsers.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchCategories();
    fetchUsers();
  }, []);

  const formFields = [
    {
      name: "name",
      type: "text",
      label: "Event Name",
      placeholder: "Enter event name",
      required: true,
    },
    {
      name: "description",
      type: "text",
      label: "Description",
      placeholder: "Event description",
    },
    { name: "date", type: "date", label: "Date", required: true },
    {
      name: "location",
      type: "text",
      label: "Location",
      placeholder: "Event location",
    },
    {
      name: "qty",
      type: "number",
      label: "Total Tickets",
      placeholder: "Number of tickets",
    },
    {
      name: "price",
      type: "number",
      label: "Ticket Price",
      placeholder: "Ticket price",
    },
    {
      name: "images",
      type: "text",
      label: "Image Url",
      placeholder: "Image Url",
    },
    {
      name: "categoryId",
      type: "select",
      label: "Category",
      options: categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
      required: true,
    },
    {
      name: "invitedUsers",
      type: "select",
      label: "Invite Team / Person",
      options: users.map((user) => ({
        value: user.id,
        label: user.username || user.email,
      })),
      multiple: true,
    },
    {
      name: "statusEvent",
      type: "select",
      label: "Event Status",
      options: [
        { value: "open", label: "Open" },
        { value: "close", label: "Close" },
        { value: "comingsoon", label: "Coming Soon" },
      ],
      required: true,
    },
  ];

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormValues((prev) => ({
    ...prev,
    [name]: value,
  }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formValues,
    });
    setFormValues({
      name: "",
      description: "",
      date: "",
      location: "",
      qty: "",
      price: "",
      categoryId: "",
      invitedUsers: [],
      statusEvent: "open",
      images: "",
    });
  };

  return (
    <FormComponent
      formFields={formFields}
      formValues={formValues}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Submit Event"
    />
  );
};

export default EventForm;
