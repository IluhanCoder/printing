// ProfilePage.tsx
import React, { useState, useEffect } from "react";
import api from "../api"; // assuming api.js handles Axios or Fetch requests

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    cardNumber: "",
    cell: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user profile data
    api.get("/user/profile")
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile API call
    api.put("/user/profile", userData)
      .then((response) => {
        alert("Profile updated successfully");
      })
      .catch((err) => {
        setError("Failed to update profile");
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={userData.username} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={userData.email} onChange={handleChange} />
        </label>
        <label>
          Card Number:
          <input type="text" name="cardNumber" value={userData.cardNumber} onChange={handleChange} />
        </label>
        <label>
          Phone Number:
          <input type="text" name="cell" value={userData.cell} onChange={handleChange} />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;
