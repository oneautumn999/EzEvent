import React from "react";
import { UserProfile } from "@clerk/clerk-react";

const ProfilePage = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white center">
      <h1 className="text-3xl font-bold mb-6">Manage Your Profile</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <UserProfile 
        //     appearance={{
        //     elements: {
        //     card: "bg-gray-800 text-white rounded-lg shadow-md",
        //     header: "text-white",
        //     button: "bg-blue-600 hover:bg-blue-700 text-white",
        //     },
        // }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;