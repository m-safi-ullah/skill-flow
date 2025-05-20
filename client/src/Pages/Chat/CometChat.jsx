import { useEffect } from "react";
import CometChatBuilderApp from "../../CometChat/CometChatBuilderApp";
import { useCookies } from "react-cookie";

const CometChat = () => {
  const [cookies] = useCookies(["token"]);
  useEffect(() => {
    if (!cookies.token) {
      window.location.href = "/sign-in";
    }
  }, [cookies.token]);
  return (
    <div className="w-auto h-[90vh]">
      <CometChatBuilderApp />
    </div>
  );
};

export default CometChat;
