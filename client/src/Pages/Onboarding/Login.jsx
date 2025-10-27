import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../Components/Forminput";
import { apiService } from "../../Services/OnboardApicall";

const LoginCard = () => {
  const [formData, setFormData] = useState({
    username: "", // JWT endpoint usually expects "username"
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);

    const payload = {
      username: formData.username,
      password: formData.password,
    };

    try {
      await apiService({
        endpoint: "api/token/",
        method: "POST",
        payload,
        onSuccess: (res) => {
          alert("Login successful!");
          console.log(res);

          localStorage.setItem("access_token", res.access);
          localStorage.setItem("refresh_token", res.refresh);
          localStorage.setItem("user_type", res.user_type);

          router("/dashboard");
        },
        onError: (err) => {
          alert(err.response?.data?.detail || "Invalid credentials!");
          console.error(err);
        },
      });
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Sign in to your Study Assistant
        </p>

        <div className="flex flex-col gap-4">
          <FormInput
            type="text"
            label="Username"
            value={formData.username}
            variant="standard"
            color="success"
            onChange={handleChange("username")}
          />
          <FormInput
            type="password"
            label="Password"
            value={formData.password}
            variant="standard"
            color="success"
            onChange={handleChange("password")}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: "#22C55E",
              "&:hover": { backgroundColor: "#16A34A" },
              color: "#fff",
              borderRadius: "0.5rem",
              paddingY: 1,
              fontWeight: 500,
              marginTop: 2,
            }}
            onClick={handleSubmit}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-500 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
