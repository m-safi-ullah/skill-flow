import { useEffect } from "react";
import CometChatBuilderApp from "../../CometChat/CometChatBuilderApp";

const CometChat = () => {
  useEffect(() => {
    if (localStorage.getItem("authentication") !== "true") {
      window.location.href = "/sign-in";
    }
  }, [localStorage.getItem("authentication")]);
  return (
    <div className="w-auto h-[90vh]">
      <CometChatBuilderApp />
    </div>
  );
};

export default CometChat;
