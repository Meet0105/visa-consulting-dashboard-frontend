import React from 'react';

interface AuthFormMessageProps {
  message: { text: string; type: "success" | "error" } | null;
}

const AuthFormMessage: React.FC<AuthFormMessageProps> = ({ message }) => {
  if (!message) return null;

  const messageClass = message.type === "success"
    ? "bg-green-100 border-green-400 text-green-700"
    : "bg-red-100 border-red-400 text-red-700";

  return (
    <div
      className={`border px-4 py-3 rounded relative ${messageClass}`}
      role="alert"
    >
      <span className="block sm:inline">{message.text}</span>
    </div>
  );
};

export default AuthFormMessage;