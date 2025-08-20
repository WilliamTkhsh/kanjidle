import React from "react";

const Toast = ({ message }) => (
  message ? (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow">
      {message}
    </div>
  ) : null
);
export default Toast;