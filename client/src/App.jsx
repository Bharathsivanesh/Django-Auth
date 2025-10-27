// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginCard from "./Pages/Onboarding/Login";
import SignUpCard from "./Pages/Onboarding/Sigin";
import NotesPage from "./Pages/Dashboard.jsx/User";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginCard />} />
        <Route path="/sigin" element={<SignUpCard />} />
        <Route path="/dashboard" element={<NotesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
