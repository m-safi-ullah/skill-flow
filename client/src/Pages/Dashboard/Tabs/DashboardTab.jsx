import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/context.jsx";
import defaultProfilePic from "../../../images/defaultProfilePic.png";
import useAxios from "../../../baseURL/axios";
import Loading from "../../../Symbols/Loading.jsx";

const DashboardTab = () => {
  const axios = useAxios();
  const { authEmail, authName, authRole } = useContext(GlobalContext);
  const [profileData, setProfileData] = useState({});

  const [loading, setLoading] = useState(false);

  // get profile data
  useEffect(() => {
    setLoading(true);
    if (authName && authEmail && authRole) {
      axios
        .get("/dashboard/getProfile", {
          params: { name: authName, email: authEmail, role: authRole },
        })
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
  }, [authName, authEmail, authRole]);
  return (
    <>
      <Loading visible={loading} />
      <div className="flex flex-wrap gap-5">
        {/* Profile */}
        {profileData && (
          <div className="bg-white shadow-lg rounded-lg p-6 w-[100%] relative">
            <Link to="/dashboard?tab=profile">
              <span className="material-symbols-outlined text-green-600 absolute top-2 right-2">
                edit_square
              </span>
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
                <h2 className="text-xl font-semibold">{authName}</h2>
                <p className="text-gray-500 text-sm mb-2">
                  @{authEmail.split("@")[0]}
                </p>
                <p className="text-gray-500 text-sm mb-2">{authEmail}</p>
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
                  ? profileData.about.substring(0, 200)
                  : "No description available"}
                ...
              </p>
            </div>
            {authRole !== "admin" && (
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
