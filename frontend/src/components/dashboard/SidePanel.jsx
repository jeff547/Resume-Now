import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faMessage,
  faCircleInfo,
  faFolder,
  faRightFromBracket,
  faCamera,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import { X } from "lucide-react";
import useLogout from "../../hooks/useLogout";
import useLocalStorage from "../../hooks/useLocalStorage";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import useApiAuth from "../../hooks/useApiAuth";

const SidePanel = ({ folders, active, setActive, isOpen, onClose }) => {
  const DELETE_USER_URL = "/users/self";
  const UPDATE_USER_URL = "/users/self";
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [openSettings, setOpenSettings] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const navigate = useNavigate();
  const logout = useLogout();
  const apiAuth = useApiAuth();

  const { user } = useAuth();

  const [email, setEmail] = useLocalStorage("email", "");
  const [validEmail, setValidEmail] = useState(false);
  const [username, setUsername] = useLocalStorage("username", "");
  const [firstName, setFirstName] = useLocalStorage("firstName", "");
  const [lastName, setLastName] = useLocalStorage("lastName", "");

  const handleCloseProfile = async () => {
    if (validEmail) {
      try {
        const response = await apiAuth.patch(UPDATE_USER_URL, {
          email,
          username,
          first_name: firstName,
          last_name: lastName,
        });
        console.log(`/update/self: ${JSON.stringify(response?.data)}`);
      } catch (err) {
        console.error(err);
      }
    }

    setOpenProfile(false);
  };

  const deleteAccount = async () => {
    try {
      const response = await apiAuth.delete(DELETE_USER_URL);
      console.log(`/delete/self: ${JSON.stringify(response?.data)}`);
      logout();
    } catch (err) {
      console.error(err);
    }
  };

  // Set user profile
  useEffect(() => {
    if (!user) return;

    user.email && setEmail(user.email);
    user.username && setUsername(user.username);
    user.firstName && setFirstName(user.firstName);
    user.lastName && setLastName(user.lastName);
  }, [user]);

  // Checks if email is in correct format
  useEffect(() => {
    const isValid = EMAIL_REGEX.test(email);
    console.log(`Email - ${email} is Valid: ${isValid}`);
    setValidEmail(isValid);
  }, [email]);

  const closeSidebar = () => {
    onClose && onClose();
  };

  return (
    <>
      {/* Settings Modal */}
      <Modal open={openSettings} onClose={() => setOpenSettings(false)}>
        <div className="flex items-center justify-between gap-64">
          <h1 className="text-sm font-medium">Settings</h1>
          <X
            className="h-auto w-4 text-gray-600 hover:text-gray-400"
            onClick={() => setOpenSettings(false)}
          />
        </div>
        <div className="my-4 mr-3 w-full border-t border-gray-600" />
        <button
          className="mx-48 cursor-pointer rounded-xl bg-red-600 px-3 py-1 text-sm text-gray-200"
          onClick={logout}
        >
          Logout
          <FontAwesomeIcon icon={faRightFromBracket} className="pl-1" />
        </button>
      </Modal>
      {/* Profile Modal */}
      <Modal open={openProfile} onClose={handleCloseProfile}>
        <div className="flex flex-col items-center gap-1 text-sm">
          {/* Modal Header */}
          <div className="justify-baseline flex items-center gap-64">
            <h1>Edit your profile</h1>
            <X
              className="h-auto w-4 text-gray-600 hover:text-gray-400"
              onClick={handleCloseProfile}
            />
          </div>
          {/* Add add profile picture functionality!!!!!! */}
          <button className="h-18 w-18 cursor-pointer rounded-[99px] bg-gray-600">
            <FontAwesomeIcon
              icon={faCamera}
              className="text-xl text-gray-100"
            />
          </button>
          <div className="mt-6 flex gap-2">
            <div>
              <label htmlFor="firstName" className="block pb-0.5">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-gray-1000 rounded-md border border-gray-800 p-0.5 pl-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block pb-0.5">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-gray-1000 rounded-md border border-gray-800 p-0.5 pl-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
              />
            </div>
          </div>

          <div className="w-full px-6">
            <label htmlFor="username" className="block pb-0.5">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-1000 w-full rounded-md border border-gray-800 p-0.5 pl-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
            />
          </div>
          <div className="w-full px-6">
            <label htmlFor="email" className="block pb-0.5">
              E-mail
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-1000 w-full rounded-md border border-gray-800 p-0.5 pl-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
            />
          </div>
          <div className="mt-8 flex items-center gap-4">
            <button
              className="cursor-pointer rounded-lg bg-gray-800 px-10 py-1 text-red-400"
              onClick={logout}
            >
              Logout
              <FontAwesomeIcon icon={faRightFromBracket} className="pl-1" />
            </button>
            <button
              className="cursor-pointer rounded-lg bg-gray-800 px-5 py-1 text-red-400"
              onClick={deleteAccount}
            >
              Delete Account
              <FontAwesomeIcon icon={faTrash} className="pl-1" />
            </button>
          </div>
        </div>
      </Modal>
      {/* Main Side Panel */}
      <aside
        id="dashboard-sidebar"
        className={`bg-gray-1100 flex h-full w-full flex-shrink-0 flex-col gap-3 border-b border-gray-900 pl-5 pr-4 text-sm text-gray-600 transition-all duration-300 ease-out ${
          isOpen
            ? "max-h-[70vh] overflow-y-auto py-4 opacity-100"
            : "max-h-0 overflow-hidden py-0 opacity-0"
        } md:max-h-none md:w-64 md:min-w-[15rem] md:overflow-y-auto md:border-b-0 md:border-r md:py-4 md:opacity-100`}
      >
        <h3
          className="cursor-pointer hover:text-gray-400"
          onClick={() => {
            setOpenProfile(true);
            closeSidebar();
          }}
        >
          <FontAwesomeIcon icon={faUser} className="pr-1" />
          Account
        </h3>
        <h3
          className="cursor-pointer hover:text-gray-400"
          onClick={() => {
            setOpenSettings(true);
            closeSidebar();
          }}
        >
          <FontAwesomeIcon icon={faGear} className="pr-1" />
          Settings
        </h3>
        <h3
          className="cursor-pointer hover:text-gray-400"
          onClick={() => {
            navigate("/#contact");
            closeSidebar();
          }}
        >
          <FontAwesomeIcon icon={faMessage} className="pr-1" />
          Contact
        </h3>
        <h3
          className="cursor-pointer hover:text-gray-400"
          onClick={() => {
            navigate("/#about");
            closeSidebar();
          }}
        >
          <FontAwesomeIcon icon={faCircleInfo} className="pr-1" />
          About Us
        </h3>
        {/* Divider */}
        <div className="my-2 mr-3 w-full border-t border-gray-800" />
        {/* TOOD: Add folder functionality */}
        <h1 className="font-medium text-gray-200">Folders</h1>
        <ul className="mr-3">
          {folders.map((folder, idx) => (
            <button
              className={`mb-2 block w-full cursor-pointer rounded-lg p-1 text-start hover:text-gray-400 ${active === idx ? "bg-gray-900 text-gray-300" : ""}`}
              key={idx}
              onClick={() => {
                setActive(idx);
                closeSidebar();
              }}
            >
              <FontAwesomeIcon icon={faFolder} className="mr-1.5" />
              {folder}
            </button>
          ))}
        </ul>
      </aside>
    </>
  );
};
export default SidePanel;
