import { useContext, useState } from "react";
import axios from "../../../baseURL/axios";
import Toast from "../../../Symbols/Toast";
import ConfirmModal from "../../../Symbols/ConfirmModal";
import { GlobalContext } from "../../context/context";

const SettingTab = () => {
  const [toast, setToast] = useState({ status: "", message: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { authRole } = useContext(GlobalContext);
  const [btnLoader, setBtnLoader] = useState(false);

  // Updated Password validation function
  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Password and confirm password must match";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must include at least one lowercase letter.";
    }

    if (!/\d/.test(password)) {
      return "Password must include at least one number.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must include at least one special character.";
    }

    return "";
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setBtnLoader(true);
    setError("");
    setToast({ status: "", message: "" });

    // Validate password strength and matching
    const validationError = validatePassword(newPassword, confirmPassword);
    if (validationError) {
      setError(validationError);
      setBtnLoader(false);
      return;
    }

    try {
      const response = await axios.post("/auth/update-password", {
        password: currentPassword,
        newpassword: newPassword,
      });

      if (response.data.success) {
        setToast({ status: "success", message: response.data.message });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setBtnLoader(false);
      } else {
        setToast({ status: "error", message: response.data.message });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setBtnLoader(false);
    }
  };
  const handleDeleteAccount = () => {
    setToast({ status: "", message: "" });
    axios
      .delete("/dashboard/delete-account")
      .then((res) => {
        if (res.data.success) {
          setToast({
            status: "success",
            message: "Account deleted successfully.",
          });
          axios.post("/auth/logout").then((response) => {
            if (response.success) {
              window.location.reload();
              window.location.href = "/sign-in";
            }
          });
        } else {
          setToast({ status: "error", message: res.data.message });
        }
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        setToast({
          status: "error",
          message: "Failed to delete account. Please try again.",
        });
      });
  };
  return (
    <div className="p-4 px-10">
      <Toast status={toast.status} message={toast.message} />
      <div className="flex gap-4 mb-4">
        <div className="w-1/2 border-r pr-14">
          <h3 className="text-xl font-medium mb-4 text-center">
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                className="w-full p-2 border mb-3 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full button text-white font-medium mt-4 rounded-lg focus:outline-none"
                disabled={btnLoader}
              >
                {!btnLoader ? "Submit" : "Processing..."}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 px-4 rounded"
              disabled={btnLoader}
            >
              {btnLoader ? "Processing..." : "Update Password"}
            </button>
          </form>
        </div>
        {authRole !== "admin" && (
          <div className="w-1/2 pl-10">
            <h3 className="text-xl text-center font-medium mb-3 text-red-600">
              Danger Zone
            </h3>
            <div className="p-4 border border-red-200 rounded-lg">
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-2">Deactivate Account</h4>
                <p className="text-gray-600 mb-4">
                  This will permanently delete your account and all associated
                  data. This action is irreversible.
                </p>
              </div>

              <ConfirmModal
                bg="bg-red-500"
                text="Deactivate Account"
                handleDelete={handleDeleteAccount}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingTab;
