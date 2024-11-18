import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import Navbar from "../../common/Navbar";
import { useParams } from "react-router-dom";

// Monaco worker setup
if (typeof MonacoEnvironment === "undefined") {
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === "javascript" || label === "typescript") {
        return "/node_modules/monaco-editor/min/vs/language/javascript/worker.js";
      }
      return "/node_modules/monaco-editor/min/vs/editor/editor.worker.js";
    },
  };
}

function Editor() {
  const websocket = useRef(null);
  const editorRef = useRef(null);
  const parm = useParams();
  const isRemoteUpdate = useRef(false); // Flag to track remote updates
  useEffect(() => {

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), delay);
        };
      };
    // Create Monaco editor instance
    const editor = monaco.editor.create(document.getElementById("editor"), {
      value: "", // Leave it empty until the backend sends the shared state
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      autoClosingDelete: "always",
      cursorSmoothCaretAnimation: true,
      wordWrap: "on",
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
    });
  
    editorRef.current = editor;
  
    // Initialize WebSocket connection
    if (!websocket.current) {
      websocket.current = new WebSocket(`ws://code-editor-6w2j.vercel.app//emit`);
    }
  
    const ws = websocket.current;
  
    ws.onopen = () => {
      console.log("WebSocket connection established");
  
      // Send an initial message with `id` to the server
      if (parm.id) {
        ws.send(JSON.stringify({ id: parm.id, code: "" })); // Send only `id` on connect
      }
    };
  
    ws.onmessage = (event) => {
        try {
          const receivedMessage = event.data;
          console.log("Received from server:", receivedMessage);
      
          isRemoteUpdate.current = true;
      
          const currentCode = editor.getValue();
          if (currentCode !== receivedMessage) {
            const currentPosition = editor.getPosition();
            editor.setValue(receivedMessage);
            if (currentPosition) {
              editor.setPosition(currentPosition);
            }
          }
      
          isRemoteUpdate.current = false;
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  
    // Handle input changes
    const handleInput = debounce(() => {
        if (isRemoteUpdate.current) {
          return;
        }
      
        const currentCode = editor.getValue();
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ code: currentCode, id: parm.id }));
        }
      }, 1000);

    // Attach input listener
    const modelContentListener = editor.onDidChangeModelContent(() => {
      handleInput();
    });
  
    // Cleanup
    return () => {
      modelContentListener.dispose();
      editor.dispose();
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [parm.id]);
  
  return (
    <>
      <Navbar />
      <div className="w-full h-screen flex text-white">
        <div id="editor" className="w-[70%] h-full"></div>
        <div className="bg-black w-[30%] text-white text-sm items-center flex flex-col p-2 gap-8">
          <h1>Language</h1>
          <div className="w-full text-white text-sm justify-center flex pl-2 gap-8">
            <p className="border h-[40px] rounded-full w-[100px] cursor-pointer hover:bg-gray-900 transition-all duration-100 text-center p-2">
              HTML
            </p>
            <p className="border h-[40px] rounded-full w-[100px] cursor-pointer hover:bg-gray-900 transition-all duration-100 text-center p-2">
              CSS
            </p>
            <p className="border h-[40px] rounded-full w-[100px] cursor-pointer hover:bg-gray-900 transition-all duration-100 text-center p-2">
              JavaScript
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Editor;
