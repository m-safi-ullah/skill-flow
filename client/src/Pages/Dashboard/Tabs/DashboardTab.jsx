import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/context.jsx";
import defaultProfilePic from "../../../images/defaultProfilePic.png";
import axios from "../../../baseURL/axios";
import Loading from "../../../Symbols/Loading.jsx";
import { FaEdit, FaEye } from "react-icons/fa";

const DashboardTab = () => {
  const { authEmail, authRole } = useContext(GlobalContext);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);

  const tab = window.location.search.split("=")[1];

  // get profile data
  useEffect(() => {
    if (tab == "dashboard") {
      setLoading(true);
      axios
        .get("/dashboard/getProfile")
        .then((res) => {
          if (res.data.success) {
            const { profile } = res.data;
            setProfileData(profile);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
        });
    }
  }, [tab]);
  return (
    <>
      <Loading visible={loading} />

      <div className="flex flex-wrap gap-5">
        <Link
          to={`/${authRole}/${authEmail.split("@")[0]}`}
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-800  font-medium px-3 hover:bg-gray-100 py-2 rounded-md text-sm transition absolute top-15 right-4"
        >
          <FaEye className="text-gray-600 text-xl" />
          Preview
        </Link>
        {/* Profile */}
        {profileData && (
          <div className="bg-white border rounded-lg p-6 w-[48%] relative">
            <Link to="/dashboard?tab=profile">
              <FaEdit className="text-green-600 absolute top-2 right-2 text-2xl" />
            </Link>

            <div className="flex items-center">
              <img
                src={
                  profileData.profilePic
                    ? `http://localhost:4400/${profileData.profilePic}`
                    : defaultProfilePic
                }
                alt="Profile Picture"
                className="w-20 h-20 rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{profileData.name}</h2>
                <p className="text-gray-500 text-sm mb-2">
                  @{authEmail.split("@")[0]}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0-2a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6z"
                    />
                  </svg>

                  {authEmail}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {profileData.address || "Address not added"}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <h2 className="text-md font-medium">About</h2>
              <p className="text-sm mt-1">
                {profileData?.about
                  ? profileData.about.substring(0, 300)
                  : "No description available"}
                ...
              </p>
            </div>
            {authRole == "seller" && (
              <div className="mt-4 border-t pt-4">
                <h2 className="text-md font-medium">Skills and Expertise</h2>
                <ul className="text-sm mt-1 flex gap-2 ">
                  {profileData?.skills &&
                  JSON.parse(profileData?.skills).length > 0
                    ? JSON.parse(profileData?.skills || "[]").map(
                        (skill, index) => (
                          <li
                            className="bg-gray-100 px-2 rounded-md"
                            key={index}
                          >
                            {skill}
                          </li>
                        )
                      )
                    : "No skills added"}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
// lg:w-[calc(50%-0.75rem)] w-[100%]
export default DashboardTab;
