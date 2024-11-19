import React, { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Editor from "./components/Editor/Editor";

export const ContextProvider = createContext(null);

function App() {
  const [sharedState, setSharedState] = useState("default value");

  return (
    <ContextProvider.Provider value={{ sharedState, setSharedState }}>
      <BrowserRouter future={{v7_relativeSplatPath: true,v7_startTransition:true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ContextProvider.Provider>
  );
}

export default App;
