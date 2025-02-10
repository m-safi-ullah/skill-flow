import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../context/context";
import defaultImg from "../../../images/defaultProfilePic.png";
import useAxios from "../../../baseURL/axios";
import CreatableSelect from "react-select/creatable";
import Toast from "../../../Symbols/Toast";
import Loading from "../../../Symbols/Loading";

const ProfileForm = () => {
  const [skills, setSkills] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [toast, setToast] = useState({ status: "", message: "" });
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([
    { value: "Baking", label: "Baking" },
    { value: "Cooking", label: "Cooking" },
    { value: "Painting", label: "Painting" },
  ]);
  const { authName, authEmail, setAuthName, authRole } =
    useContext(GlobalContext);
  const axios = useAxios();

  // Handle file input change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  // set profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ status: "", message: "" });
    const formData = new FormData();
    setLoading(true);
    setAuthName(e.target.name.value);
    formData.append("name", e.target.name.value);
    formData.append("email", authEmail);
    formData.append("role", authRole);
    formData.append("phone", e.target.phone.value);
    formData.append("address", e.target.address.value);
    formData.append("about", e.target.about.value);
    formData.append("skills", JSON.stringify(skills));

    if (profileFile) {
      formData.append("profilePic", profileFile);
    } else {
      console.warn("No profile picture selected");
    }

    try {
      await axios
        .post("/dashboard/setProfile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.success) {
            setLoading(false);
            setToast({ status: "success", message: res.data.message });
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          } else {
            setToast({ status: "error", message: res.data.message });
          }
        });
    } catch (error) {
      console.error("Error updating profile:", error);
      setToast({ status: "error", message: "Error updating profile" });
    }
  };

  // get profile data
  useEffect(() => {
    if (authName && authEmail && authRole) {
      setLoading(true);
      axios
        .get("/dashboard/getProfile", {
          params: { name: authName, email: authEmail, role: authRole },
        })
        .then((res) => {
          if (res.data.success) {
            const { profile } = res.data;
            setProfilePic(profile.profilePic);
            setSkills(profile.skills ? JSON.parse(profile.skills) : []);
            document.getElementsByName("name")[0].value = profile.name;
            document.getElementsByName("phone")[0].value = profile.phone || "";
            document.getElementsByName("address")[0].value = profile.address;
            document.getElementsByName("about")[0].value = profile.about;
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
        });
    }
  }, [authName, authEmail, authRole]);

  return (
    <div className="p-5">
      <Loading visible={loading} />
      <Toast status={toast.status} message={toast.message} />
      <form onSubmit={handleSubmit} className="profileTab">
        <h3 className="text-xl font-medium mb-3">Personal Information</h3>
        <div className="mb-4 flex m-auto items-center gap-5">
          <div>
            <img
              src={
                profilePic
                  ? profilePic.includes("upload")
                    ? `http://localhost:4400/${profilePic}`
                    : profilePic
                  : defaultImg
              }
              className="rounded-full"
              alt="Profile"
            />
          </div>
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">
              Profile Pic
            </label>
            <input
              type="file"
              name="profilePic"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </div>
        </div>

        <div className="flex gap-5 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={authName}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={authEmail}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              readOnly
              required
            />
          </div>
        </div>

        <div className="flex gap-5 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium mb-2">
              Phone
            </label>
            <input
              type="number"
              name="phone"
              min={0}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your phone"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your address"
            />
          </div>
        </div>

        <h3 className="text-xl font-medium mb-3">About</h3>
        <div className="mb-4">
          <textarea
            name="about"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Write about yourself"
            maxLength={500}
            rows="4"
          />
        </div>
        {authRole !== "admin" && (
          <>
            <h3 className="text-xl font-medium mb-3">Skills and Expertise</h3>
            <CreatableSelect
              isMulti
              name="skills"
              options={options}
              className="mb-3 basic-multi-select"
              classNamePrefix="select"
              value={
                skills.length > 0
                  ? skills.map((skill) => ({ value: skill, label: skill }))
                  : []
              }
              onChange={(selectedOptions) => {
                setSkills(selectedOptions.map((option) => option.value));
              }}
              onCreateOption={(inputValue) => {
                const newOption = {
                  value: inputValue.toLowerCase(),
                  label: inputValue,
                };
                setOptions((prev) => [...prev, newOption]);
                setSkills((prev) => [...prev, newOption.value]);
              }}
            />
          </>
        )}
        <button
          type="submit"
          className="w-full bg-secondry text-white font-medium py-2 rounded-lg"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
