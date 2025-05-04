import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // We'll move your current App logic here
import AnimeInfo from "./pages/AnimeInfo"; // Assuming AnimeInfo is placed in /pages

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:id" element={<AnimeInfo />} />
      </Routes>
    </Router>
  );
};

export default App;



