import React, { useState, useEffect } from "react";
import FormComponent from "../elements/FormContainer";

const TaskForm = ({ onSubmit, initialValues = {} }) => {
  const [formValues, setFormValues] = useState({
      name: initialValues.name || "",
      team: initialValues.team || "",
      startDate: initialValues.startDate || "",
      endDate: initialValues.endDate || "",
      status: initialValues.status || "todo",
      description: initialValues.description || "",
  });

  const formFields = [
    {
      name: "name",
      type: "text",
      label: "Task Name",
      placeholder: "Enter task name",
      required: true,
      errorMessage: "Task name is required",
    },
    {
      name: "team",
      type: "text",
      label: "Team",
      placeholder: "Enter team name",
      required: true,
      errorMessage: "Team name is required",
    },
    {
      name: "startDate",
      type: "date",
      label: "Start Date",
      placeholder: "Select start date",
      required: true,
      errorMessage: "Start date is required",
    },
    {
      name: "endDate",
      type: "date",
      label: "End Date",
      placeholder: "Select end date",
      required: true,
      errorMessage: "End date is required",
    },
    ...(Object.keys(initialValues).length === 0
      ? [
          {
            name: "status",
            type: "select",
            label: "Status",
            options: [
              { value: "todo", label: "To Do" },
              { value: "inProgress", label: "In Progress" },
              { value: "done", label: "Done" },
            ],
            required: true,
            errorMessage: "Status is required",
          },
        ]
      : []),
    {
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Enter task description",
      rows: 5,
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
    onSubmit(formValues);
    setFormValues({
      name: "",
      team: "",
      startDate: "",
      endDate: "",
      status: "todo", 
      description: "",
    });
  };

  return (
    <FormComponent
      formFields={formFields}
      formValues={formValues}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Submit Task"
    />
  );
};

export default TaskForm;