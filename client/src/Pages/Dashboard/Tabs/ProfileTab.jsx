import React, { useState, useContext } from "react";
import { GlobalContext } from "../../context/context";
import defaultImg from "../../../images/defaultProfilePic.png";

const ProfileForm = () => {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const { authName, authEmail } = useContext(GlobalContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    debugger;
  };

  const handleProfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit}>
        <h3 className="text-xl font-medium mb-3">Personal Information</h3>
        <div className="mb-4 flex m-auto items-center gap-5">
          <div>
            <img
              src={profilePic || defaultImg}
              width={130}
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
              onChange={handleProfile}
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
              value={name || authName}
              onChange={(e) => setName(e.target.value)}
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
              value={authEmail}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your phone"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your address"
              required
            />
          </div>
        </div>

        {/* About Section */}
        <h3 className="text-xl font-medium mb-3">About</h3>
        <div className="mb-4">
          <textarea
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Write about yourself"
            maxLength={500}
            rows="4"
            required
          />
        </div>

        {/* Skills */}
        <h3 className="text-xl font-medium mb-3">Skills and Expertise</h3>
        <div className="mb-4">
          <input
            type="text"
            name="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter your skills saparated by comma"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-secondry text-white font-medium py-2 rounded-lg focus:outline-none"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
