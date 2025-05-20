import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  UIKitSettingsBuilder,
  CometChatUIKit,
} from "@cometchat/chat-uikit-react";
import { setupLocalization } from "./CometChat/utils/utils";
import { BuilderSettingsProvider } from "./CometChat/context/BuilderSettingsContext";
import { GlobalProvider } from "./Pages/context/context.jsx";
import { BrowserRouter as Router } from "react-router-dom";

export const COMETCHAT_CONSTANTS = {
  APP_ID: "275687e9c016ec01",
  REGION: "US",
  AUTH_KEY: "5b21199a82725f6b1cbb857e331142fa454f0c21",
};

const uiKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID)
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
  .subscribePresenceForAllUsers()
  .build();

CometChatUIKit.init(uiKitSettings)?.then(() => {
  setupLocalization();

  const UID = "cometchat-uid-5";

  CometChatUIKit.getLoggedinUser().then((user: CometChat.User | null) => {
    if (!user) {
      CometChatUIKit.login(UID)
        .then((loggedUser: CometChat.User) => {
          console.log("Login Successful:", loggedUser);
          ReactDOM.createRoot(
            document.getElementById("root") as HTMLElement
          ).render(
            <BuilderSettingsProvider>
              <GlobalProvider>
                <Router>
                  <App />
                </Router>
              </GlobalProvider>
            </BuilderSettingsProvider>
          );
        })
        .catch((error) => console.error("Login Failed:", error));
    } else {
      console.log("User already logged in:", user);
      ReactDOM.createRoot(
        document.getElementById("root") as HTMLElement
      ).render(
        <BuilderSettingsProvider>
          <GlobalProvider>
            <Router>
              <App />
            </Router>
          </GlobalProvider>
        </BuilderSettingsProvider>
      );
    }
  });
});
