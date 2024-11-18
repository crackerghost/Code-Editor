import {createContext, React, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Navbar from "./common/Navbar";
import Home from "./components/Home/Home";
import Editor from "./components/Editor/Editor";
import axios from "axios";
export const contextProvider = createContext()
function App() {
      
  return (
    <contextProvider.Provider >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
    </contextProvider.Provider>
  );
}

export default App;
