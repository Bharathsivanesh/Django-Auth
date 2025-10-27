import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../Services/OnboardApicall";

const Navbar = () => {
  const router = useNavigate();

  const userRole = localStorage.getItem("user_type") || "user";
  const username = localStorage.getItem("username") || "Guest";
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const handleLogout = async () => {
    if (!refreshToken) {
      localStorage.clear();
      router("/");
      return;
    }

    try {
      await apiService({
        endpoint: "api/logout/",
        method: "POST",
        payload: { refresh: refreshToken },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        onSuccess: () => {
          alert("Logout successful!");
          localStorage.clear();
          router("/");
        },
        onError: (err) => {
          console.error(err);
          alert("Logout failed. Please try again.");
          localStorage.clear();
          router("/");
        },
      });
    } catch (error) {
      console.error("Logout Error:", error);
      localStorage.clear();
      router("/");
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex flex-col md:flex-row justify-between items-center md:items-stretch gap-3 md:gap-0">
      {/* Left side - Logo */}
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-2xl font-bold text-green-600">
          NotesApp
        </Link>
      </div>

      {/* Right side - User Info & Logout */}
      <div className="flex items-center gap-4 mt-3 md:mt-0">
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
          <span className="font-medium text-gray-700">{username}</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              userRole === "admin"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {userRole === "admin" ? "Admin" : "User"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md font-medium transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
