import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../Components/Forminput";
import { apiService } from "../../Services/OnboardApicall";

const SignUpCard = () => {
  const router = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      user_type: "user", // static
    };

    try {
      await apiService({
        endpoint: "api/register/",
        method: "POST",
        payload,
        onSuccess: (res) => {
          alert("User registered successfully!");
          router("/");
          console.log(res);
        },
        onError: (err) => {
          alert(err.response?.data?.message || "Something went wrong!");
          console.error(err);
        },
      });
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Sign up for your Study Assistant
        </p>

        <div className="flex flex-col gap-4">
          <FormInput
            type="text"
            label="Username"
            value={formData.username}
            onChange={handleChange("username")}
            variant="standard"
            color="success"
          />
          <FormInput
            type="email"
            label="Email address"
            value={formData.email}
            onChange={handleChange("email")}
            variant="standard"
            color="success"
          />
          <FormInput
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange("password")}
            variant="standard"
            color="success"
          />
          <FormInput
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            variant="standard"
            color="success"
          />

          <Button
            variant="contained"
            fullWidth
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
            Sign Up
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-green-500 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpCard;
