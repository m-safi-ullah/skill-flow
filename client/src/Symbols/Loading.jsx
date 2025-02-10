import React from "react";

const Loading = ({ visible }) => {
  return (
    <div>
      {visible && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-x-2 border-secondry"></div>
        </div>
      )}
    </div>
  );
};

export default Loading;
