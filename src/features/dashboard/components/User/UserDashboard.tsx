import React from "react";

const UserDashboard = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Digital Invoicing</h1>
        <p className="text-gray-600">Your dashboard is ready. Use the "Send Invoice" button in the header to create invoices.</p>
      </div>
    </div>
  );
};

export default UserDashboard;
