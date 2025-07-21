// src/components/ThreadCard.jsx
import React from "react";

export default function ThreadCard({ thread }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <div className="text-sm text-gray-600">{thread.author}</div>
      <div className="text-base text-gray-900 mt-1">{thread.content}</div>
      <div className="text-xs text-gray-500 mt-2">{new Date(thread.timestamp).toLocaleString()}</div>
      <div className="flex space-x-4 mt-3 text-sm text-gray-500">
        <span>👍 {thread.likes}</span>
        <span>💬 {thread.comments} comments</span>
      </div>
    </div>
  );
}
